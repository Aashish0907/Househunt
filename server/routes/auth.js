const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { _id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, role: role === 'owner' ? 'owner' : 'renter', password: await bcrypt.hash(password, 10) });
    res.status(201).json(sign(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json(sign(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/me', protect, (req, res) => res.json(req.user));
module.exports = router;
