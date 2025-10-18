const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accommodations",
    required: true
  },
  roomcount: {
    type: Number
  },
  availableroomcount: {
    type: Number
  },
  type: {
    type: String,
    enum: ["luxury", "standard"],
    required: true
  },
  isAC: {
    type: Boolean,
    default: false
  },
  maxOccupancy: {
    type: Number
  },
  isPetsAllowed: {
    type: Boolean,
    default: false
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  description: String,
  images: [String] // URLs of room images
}, {
  timestamps: true,
  collection: 'rooms'
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;