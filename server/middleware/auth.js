const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
    const { id } = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
};
exports.role = (r) => (req, res, next) =>
  req.user.role === r ? next() : res.status(403).json({ message: `Only ${r}s can do this` });
