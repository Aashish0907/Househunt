const router = require('express').Router();
const Property = require('../models/Property');
const { protect, role } = require('../middleware/auth');

// Search filters: q, city, type, minRent, maxRent, bedrooms, amenity (comma list), sort
router.get('/', async (req, res) => {
  try {
    const { q, city, type, minRent, maxRent, bedrooms, amenity, sort } = req.query;
    const f = { available: true };
    if (city) f.city = new RegExp(city, 'i');
    if (q) f.$or = [{ title: new RegExp(q, 'i') }, { address: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
    if (type) f.type = type;
    if (bedrooms) f.bedrooms = { $gte: Number(bedrooms) };
    if (minRent || maxRent) f.rent = { ...(minRent && { $gte: Number(minRent) }), ...(maxRent && { $lte: Number(maxRent) }) };
    if (amenity) f.amenities = { $all: amenity.split(',').map((a) => new RegExp(`^${a.trim()}$`, 'i')) };
    const order = sort === 'low' ? { rent: 1 } : sort === 'high' ? { rent: -1 } : { createdAt: -1 };
    res.json(await Property.find(f).sort(order).populate('owner', 'name phone email'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/mine/list', protect, role('owner'), async (req, res) =>
  res.json(await Property.find({ owner: req.user._id }).sort({ createdAt: -1 })));

router.get('/:id', async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).populate('owner', 'name phone email');
    if (!p) return res.status(404).json({ message: 'Property not found' });
    res.json(p);
  } catch { res.status(404).json({ message: 'Property not found' }); }
});

router.post('/', protect, role('owner'), async (req, res) => {
  try {
    const b = req.body;
    if (typeof b.amenities === 'string') b.amenities = b.amenities.split(',').map((s) => s.trim()).filter(Boolean);
    res.status(201).json(await Property.create({ ...b, owner: req.user._id }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', protect, role('owner'), async (req, res) => {
  const p = await Property.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true });
  p ? res.json(p) : res.status(404).json({ message: 'Not found or not yours' });
});

router.delete('/:id', protect, role('owner'), async (req, res) => {
  const p = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  p ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found or not yours' });
});
module.exports = router;
