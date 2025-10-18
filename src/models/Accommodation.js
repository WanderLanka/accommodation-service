const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  accommodationType: {
    type: String,
    required: true,
    enum: ['hotel', 'resort', 'guesthouse', 'homestay']
  },
  totalRooms: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '11:00'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'accommodations'
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;