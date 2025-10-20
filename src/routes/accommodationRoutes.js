const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getAccommodations,
  getAccommodationById,
  addAccommodation,
  updateAccommodation,
  getAllAccommodationsPublic,
  getAccommodationByIdPublic,
  decreaseRoomAvailability,
  increaseRoomAvailability
} = require('../controllers/accommodationController');

// Add a debug log to check what route is being received
router.use((req, res, next) => {
  console.log(`🔍 Accommodation Service received request: ${req.method} ${req.originalUrl}`);
  next();
});

// PUBLIC ENDPOINTS (for normal users browsing)
// Get all accommodations for public browsing
router.get('/accommodations', getAllAccommodationsPublic);

// Alternative route that might be received from proxy
router.get('/api/accommodation/accommodations', getAllAccommodationsPublic);

// Get specific accommodation by ID for public viewing
router.get('/accommodations/:id', getAccommodationByIdPublic);
// Alias to support requests forwarded by API Gateway or other clients that keep the prefix
router.get('/api/accommodation/accommodations/:id', getAccommodationByIdPublic);

// PROVIDER ENDPOINTS (for accommodation providers - authenticated)
// Get all accommodations for authenticated user
router.get('/places', verifyToken, getAccommodations);
// Alias for requests arriving as /api/accommodation/places
router.get('/api/accommodation/places', verifyToken, getAccommodations);

// Get specific accommodation by ID
router.get('/hotel/:id', verifyToken, getAccommodationById);
// Alias for provider-specific hotel details when proxy keeps the /api/accommodation prefix
router.get('/api/accommodation/hotel/:id', verifyToken, getAccommodationById);

// Add new accommodation
router.post('/addhotels', verifyToken, addAccommodation);

// Update accommodation
router.put('/updatehotel/:id', verifyToken, updateAccommodation);

// Room availability adjustments (internal use by booking-service)
// Decrease availableRooms for given room types and quantities
router.put('/accommodations/:id/room-types/decrease', decreaseRoomAvailability);
// Increase availableRooms (e.g., when booking ends)
router.put('/accommodations/:id/room-types/increase', increaseRoomAvailability);

module.exports = router;