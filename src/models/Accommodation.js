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
  price: {
    type: Number,
    required: true,
    default: 0
  },
  images: {
    type: [String],
    default: ['/placeholder-hotel.jpg']
  },
  description: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  amenities: {
    type: [String],
    default: []
  },
  roomTypes: {
    type: [{
      name: String,
      size: String,
      occupancy: Number,
      price: Number
    }],
    default: []
  },
  reviews: {
    type: Number,
    default: 0
  },
  nearbyAttractions: {
    type: [{
      name: String,
      type: String,
      distance: String
    }],
    default: []
  },
  policies: {
    type: [String],
    default: []
  },
  userReviews: {
    type: [{
      name: String,
      profileImage: String,
      rating: Number,
      review: String,
      date: String,
      helpful: Number
    }],
    default: []
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