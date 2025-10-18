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

// PUBLIC ENDPOINTS - for normal users browsing accommodations

// Get all accommodations for public browsing (no authentication required)
const getAllAccommodationsPublic = async (req, res) => {
  try {
    console.log('Fetching all accommodations for public listing');
    
    // Get all accommodations without user filtering for public display
    const accommodations = await Accommodation.find({});
    
    console.log('Found accommodations:', accommodations.length);
    res.status(200).json({ 
      success: true,
      data: accommodations,
      count: accommodations.length 
    });
  } catch (err) {
    console.error('Error fetching accommodations:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch accommodations'
    });
  }
};

// Get accommodation by ID for public viewing (no authentication required)
const getAccommodationByIdPublic = async (req, res) => {
  try {
    const accommodationId = req.params.id;
    console.log('Fetching accommodation by ID:', accommodationId);
    
    const accommodation = await Accommodation.findById(accommodationId);
    
    if (!accommodation) {
      return res.status(404).json({ 
        success: false,
        error: 'Accommodation not found' 
      });
    }
    
    console.log('Found accommodation:', accommodation.name);
    res.status(200).json({ 
      success: true,
      data: accommodation 
    });
  } catch (err) {
    console.error('Error fetching accommodation:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch accommodation'
    });
  }
};

module.exports = {
  getAccommodations,
  getAccommodationById,
  addAccommodation,
  updateAccommodation,
  getAllAccommodationsPublic,
  getAccommodationByIdPublic
};