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
    const hotel = await Accommodation.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    console.log('Found hotel:', hotel.name);
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

    // Normalize coordinates if provided as strings
    if (hotelData.coordinates) {
      const { lat, lng } = hotelData.coordinates;
      hotelData.coordinates = {
        lat: typeof lat === 'string' ? parseFloat(lat) : lat,
        lng: typeof lng === 'string' ? parseFloat(lng) : lng
      };
    }

    // Normalize roomTypes (ensure numbers, enforce availableRooms <= totalRooms)
    if (Array.isArray(hotelData.roomTypes)) {
      hotelData.roomTypes = hotelData.roomTypes.map((rt) => {
        const totalRooms = typeof rt.totalRooms === 'string' ? parseInt(rt.totalRooms) : rt.totalRooms;
        let availableRooms = typeof rt.availableRooms === 'string' ? parseInt(rt.availableRooms) : rt.availableRooms;
        const pricePerNight = typeof rt.pricePerNight === 'string' ? parseFloat(rt.pricePerNight) : rt.pricePerNight;
        const occupancy = typeof rt.occupancy === 'string' ? parseInt(rt.occupancy) : rt.occupancy;
        const safeTotal = Number.isFinite(totalRooms) ? totalRooms : 0;
        const safeAvailable = Number.isFinite(availableRooms) ? Math.min(availableRooms, safeTotal) : safeTotal;
        return {
          type: rt.type,
          pricePerNight,
          totalRooms: safeTotal,
          availableRooms: safeAvailable,
          size: rt.size,
          occupancy: Number.isFinite(occupancy) ? occupancy : undefined
        };
      });
    }
    
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
    if (updateData.coordinates) {
      const { lat, lng } = updateData.coordinates;
      updateData.coordinates = {
        lat: typeof lat === 'string' ? parseFloat(lat) : lat,
        lng: typeof lng === 'string' ? parseFloat(lng) : lng
      };
    }

    if (Array.isArray(updateData.roomTypes)) {
      updateData.roomTypes = updateData.roomTypes.map((rt) => {
        const totalRooms = typeof rt.totalRooms === 'string' ? parseInt(rt.totalRooms) : rt.totalRooms;
        let availableRooms = typeof rt.availableRooms === 'string' ? parseInt(rt.availableRooms) : rt.availableRooms;
        const pricePerNight = typeof rt.pricePerNight === 'string' ? parseFloat(rt.pricePerNight) : rt.pricePerNight;
        const occupancy = typeof rt.occupancy === 'string' ? parseInt(rt.occupancy) : rt.occupancy;
        const safeTotal = Number.isFinite(totalRooms) ? totalRooms : 0;
        const safeAvailable = Number.isFinite(availableRooms) ? Math.min(availableRooms, safeTotal) : safeTotal;
        return {
          type: rt.type,
          pricePerNight,
          totalRooms: safeTotal,
          availableRooms: safeAvailable,
          size: rt.size,
          occupancy: Number.isFinite(occupancy) ? occupancy : undefined
        };
      });
    }
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

// Adjust room availability for embedded roomTypes
async function adjustRoomAvailability(req, res, direction) {
  try {
    const hotelId = req.params.id;
    const { adjustments } = req.body; // [{ type, quantity }]
    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      return res.status(400).json({ success: false, error: 'adjustments array is required' });
    }
    const hotel = await Accommodation.findById(hotelId);
    if (!hotel) return res.status(404).json({ success: false, error: 'Accommodation not found' });

    const typeToQty = new Map(adjustments.map(a => [a.type, parseInt(a.quantity) || 0]));
    hotel.roomTypes = (hotel.roomTypes || []).map(rt => {
      if (!typeToQty.has(rt.type)) return rt;
      const q = typeToQty.get(rt.type);
      if (direction === 'decrease') {
        const next = Math.max(0, (rt.availableRooms || 0) - q);
        return { ...rt.toObject?.() || rt, availableRooms: next };
      }
      if (direction === 'increase') {
        const total = rt.totalRooms || 0;
        const next = Math.min(total, (rt.availableRooms || 0) + q);
        return { ...rt.toObject?.() || rt, availableRooms: next };
      }
      return rt;
    });
    await hotel.save();
    return res.json({ success: true, data: hotel });
  } catch (err) {
    console.error('Room availability adjustment failed:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

const decreaseRoomAvailability = (req, res) => adjustRoomAvailability(req, res, 'decrease');
const increaseRoomAvailability = (req, res) => adjustRoomAvailability(req, res, 'increase');

 
module.exports = {
  getAccommodations,
  getAccommodationById,
  addAccommodation,

  updateAccommodation,
  getAllAccommodationsPublic,
  getAccommodationByIdPublic,
  decreaseRoomAvailability,
  increaseRoomAvailability

};