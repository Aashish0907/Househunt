const mongoose = require('mongoose');
module.exports = mongoose.model('Property', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  city: { type: String, required: true },
  address: String,
  type: { type: String, enum: ['Apartment', 'House', 'Villa', 'Studio', 'PG'], default: 'Apartment' },
  rent: { type: Number, required: true },
  deposit: Number,
  bedrooms: { type: Number, default: 1 },
  areaSqft: Number,
  amenities: [String],
  imageUrl: String,
  tourUrl: String,
  available: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }));
