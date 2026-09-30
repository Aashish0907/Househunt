require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Property.deleteMany(), Booking.deleteMany()]);
  const pw = await bcrypt.hash('password123', 10);
  const owner = await User.create({ name: 'Demo Owner', email: 'owner@househunt.com', phone: '9999999999', password: pw, role: 'owner' });
  await User.create({ name: 'Demo Renter', email: 'renter@househunt.com', phone: '8888888888', password: pw, role: 'renter' });
  const img = (id) => `https://images.unsplash.com/${id}?w=800&q=70`;
  await Property.insertMany([
    { title: '2BHK near Hinjewadi IT Park', city: 'Pune', address: 'Phase 1, Hinjewadi', type: 'Apartment', rent: 22000, deposit: 66000, bedrooms: 2, areaSqft: 950, amenities: ['Parking', 'Gym', 'WiFi', 'Lift'], imageUrl: img('photo-1502672260266-1c1ef2d93688'), description: 'Bright semi-furnished flat, 10 minutes from IT park.', owner: owner._id },
    { title: 'Cozy Studio in Koregaon Park', city: 'Pune', address: 'Lane 5, Koregaon Park', type: 'Studio', rent: 15000, deposit: 30000, bedrooms: 1, areaSqft: 450, amenities: ['WiFi', 'AC', 'Lift'], imageUrl: img('photo-1522708323590-d24dbb6b0267'), description: 'Fully furnished studio in a prime location.', owner: owner._id },
    { title: '3BHK Villa with Garden', city: 'Mumbai', address: 'Powai', type: 'Villa', rent: 85000, deposit: 255000, bedrooms: 3, areaSqft: 2000, amenities: ['Parking', 'Garden', 'Security', 'Gym'], imageUrl: img('photo-1564013799919-ab600027ffc6'), description: 'Spacious villa in a gated community.', owner: owner._id },
    { title: '1BHK Budget Flat', city: 'Nashik', address: 'College Road', type: 'Apartment', rent: 8000, deposit: 16000, bedrooms: 1, areaSqft: 500, amenities: ['Parking', 'Water Supply'], imageUrl: img('photo-1560448204-e02f11c3d0e2'), description: 'Affordable flat near market and bus stand.', owner: owner._id }
  ]);
  console.log('Seeded. owner@househunt.com / renter@househunt.com  (password123)');
  process.exit();
})();
