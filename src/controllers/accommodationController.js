const Accommodation = require('../models/Accommodation');
const Room = require('../models/Room');

// Get all accommodations for the authenticated user
const getAccommodations = async (req, res) => {
  try {
    console.log('Fetching places for user:', req.user.username);
    
    const places = await Accommodation.find({ userId: req.user.username });
    
    console.log('Found places:', places.length);
    res.status(200).json(places);
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get accommodation by ID
const getAccommodationById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Accommodation.find({ _id: hotelId });

    console.log('Found hotel:', hotel.length);
    res.status(200).json(hotel);
  } catch (err) {
    console.error('Error fetching hotel:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add new accommodation
const addAccommodation = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      userId: req.user.username
    };
    
    console.log('Adding hotel for user:', hotelData.userId);
    
    const newHotel = new Accommodation(hotelData);
    await newHotel.save();
    
    console.log('Hotel added successfully:', newHotel);
    res.status(201).json(newHotel);
  } catch (err) {
    console.error('Error adding hotel:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update accommodation
const updateAccommodation = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const updateData = req.body;
    const updatedHotel = await Accommodation.findByIdAndUpdate(hotelId, updateData, { new: true });
    
    if (!updatedHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    console.log('Hotel updated successfully:', updatedHotel);
    res.status(200).json(updatedHotel);
  } catch (err) {
    console.error('Error updating hotel:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAccommodations,
  getAccommodationById,
  addAccommodation,
  updateAccommodation
};