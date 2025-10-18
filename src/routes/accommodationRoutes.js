const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getAccommodations,
  getAccommodationById,
  addAccommodation,
  updateAccommodation
} = require('../controllers/accommodationController');

// Get all accommodations for authenticated user
router.get('/places', verifyToken, getAccommodations);

// Get specific accommodation by ID
router.get('/hotel/:id', verifyToken, getAccommodationById);

// Add new accommodation
router.post('/addhotels', verifyToken, addAccommodation);

// Update accommodation
router.put('/updatehotel/:id', verifyToken, updateAccommodation);

module.exports = router;