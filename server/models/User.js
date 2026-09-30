const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['renter', 'owner'], default: 'renter' }
}, { timestamps: true }));
