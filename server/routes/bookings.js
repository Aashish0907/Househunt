const router = require('express').Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect, role } = require('../middleware/auth');

router.post('/', protect, role('renter'), async (req, res) => {
  try {
    const { propertyId, message, moveInDate } = req.body;
    const p = await Property.findById(propertyId);
    if (!p) return res.status(404).json({ message: 'Property not found' });
    const dup = await Booking.findOne({ property: p._id, renter: req.user._id, status: 'pending' });
    if (dup) return res.status(400).json({ message: 'You already have a pending request for this property' });
    res.status(201).json(await Booking.create({ property: p._id, renter: req.user._id, owner: p.owner, message, moveInDate }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.get('/mine', protect, role('renter'), async (req, res) =>
  res.json(await Booking.find({ renter: req.user._id }).sort({ createdAt: -1 }).populate('property', 'title city rent').populate('owner', 'name phone email')));

router.get('/received', protect, role('owner'), async (req, res) =>
  res.json(await Booking.find({ owner: req.user._id }).sort({ createdAt: -1 }).populate('property', 'title city rent').populate('renter', 'name phone email')));

router.patch('/:id', protect, role('owner'), async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const b = await Booking.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { status }, { new: true });
  if (!b) return res.status(404).json({ message: 'Not found' });
  if (status === 'approved') await Property.findByIdAndUpdate(b.property, { available: false });
  res.json(b);
});
module.exports = router;
