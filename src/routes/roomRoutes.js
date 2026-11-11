const roomOwnership = require('../middleware/roomOwnership');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getRoomsByHotel,
  getRoomById,
  addRoom,
  updateRoom
} = require('../controllers/roomController');

// Get rooms by hotel ID
router.get('/places/:id', verifyToken, roomOwnership, getRoomsByHotel);

// Get specific room by ID
router.get('/rooms/:id', verifyToken, roomOwnership, getRoomById);

// Add new room
router.post('/addrooms', verifyToken, roomOwnership, addRoom);

// Update room
router.put('/updateroom/:id', verifyToken, roomOwnership, updateRoom);

module.exports = router;
