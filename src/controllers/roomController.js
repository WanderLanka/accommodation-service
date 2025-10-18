const Room = require('../models/Room');

// Get rooms by hotel ID
const getRoomsByHotel = async (req, res) => {
  try {
    console.log('Fetching rooms for hotel:', req.params.id);
    
    const hotelId = req.params.id;
    const rooms = await Room.find({ hotel: hotelId });

    console.log('Found rooms:', rooms.length);
    res.status(200).json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.find({ _id: roomId });

    console.log('Found room:', room.length);
    res.status(200).json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add new room
const addRoom = async (req, res) => {
  try {
    const roomData = {
      ...req.body
    };

    const newRoom = new Room(roomData);
    await newRoom.save();

    console.log('Room added successfully:', newRoom);
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Error adding room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update room
const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updateData = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    
    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    console.log('Room updated successfully:', updatedRoom);
    res.status(200).json(updatedRoom);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getRoomsByHotel,
  getRoomById,
  addRoom,
  updateRoom
};