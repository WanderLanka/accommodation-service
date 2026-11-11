const mongoose = require('mongoose');
const Accommodation = require('../models/Accommodation');
const Room = require('../models/Room');

module.exports = async (req, res, next) => {
  try {
    let hotel = req.body?.hotel || req.params.id;
    if (req.path.startsWith('/rooms/') || req.path.startsWith('/updateroom/')) {
      if (!mongoose.isValidObjectId(req.params.id)) return res.sendStatus(400);
      const room = await Room.findById(req.params.id).lean();
      hotel = room?.hotel;
      if (req.body) delete req.body.hotel;
    }
    if (!mongoose.isValidObjectId(hotel)) return res.status(400).json({ error: 'Invalid hotel id' });
    if (!await Accommodation.findOne({ _id: hotel, userId: req.user.username }).lean()) return res.status(404).json({ error: 'Hotel not found' });
    return next();
  } catch (error) { return next(error); }
};
