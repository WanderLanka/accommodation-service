require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Add this line
}));
app.use(express.json());

// Add request logging with headers
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Authorization header:', req.headers.authorization);
  next();
});

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

// models/Room.js


const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accommodations",
    required: true
  },
  roomcount:{
    type:Number
  },
  availableroomcount:{
    type:Number
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
  maxOccupancy:{
    type:Number
  },
  isPetsAllowed: {
    type: Boolean,
    default: false
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  pricePerDay:{
    type:Number,
    required:true
  },



  description: String,
  images: [String] // URLs of room images
}, {
  timestamps: true,
  collection:'rooms'
});

const Room = mongoose.model("Room", roomSchema);



const connectDB = async () => {
  try {
    // Change this to connect to 'test' database where your data exists
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
    console.log('Connecting to MongoDB:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Verifying token:', token ? 'Token provided' : 'No token');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    console.log('Token verified successfully for user:', req.user.username);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.get('/places', verifyToken, async (req, res) => {
  try {
    console.log('Fetching places for user:', req.user.username);
    
    // For testing, return all vehicles first
    // Later you can filter by userId: const vehicles = await Vehicle.find({ userId: req.user.userId });
    const places = await Accommodation.find({userId:req.user.username}); // Use username if userId not available
    
    console.log('Found places:', places.length);
    res.status(200).json(places);
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/places/:id', verifyToken, async (req, res) => {
  try {
    console.log('Fetching rooms for user:', req.user.username);
    
    // For testing, return all vehicles first
    // Later you can filter by userId: const vehicles = await Vehicle.find({ userId: req.user.userId });
    const hotelId = req.params.id; // ✅ Get id from URL
    const rooms = await Room.find({ hotel: hotelId })

    console.log('Found rooms:', rooms.length);
    res.status(200).json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/hotel/:id',verifyToken, async (req, res) => {
   try {
   
    const hotelId = req.params.id; // ✅ Get id from URL
    const hotel = await Accommodation.find({ _id: hotelId })

    console.log('Found rooms:', hotel.length);
    res.status(200).json(hotel);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }           
}     
);

app.get('/rooms/:id', verifyToken, async (req, res) => {
   try {
    const roomId = req.params.id; // ✅ Get id from URL
    const room = await Room.find({ _id: roomId })

    console.log('Found rooms:', room.length);
    res.status(200).json(room);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }   
}     
);  

app.post('/addhotels', verifyToken, async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      userId:req.user.username // Use username if userId not available
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
}
);

app.post('/addrooms', verifyToken, async (req, res) => {
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
});


app.put('/updatehotel/:id', verifyToken, async (req, res) => {
  try { 
    const hotelId = req.params.id;
    const updateData = req.body;
    const updatedhotel = await Accommodation.findByIdAndUpdate(hotelId, updateData, { new: true });
    if (!updatedhotel) {
      return res.status(404).json({ error: 'hotel not found' });
    }
    console.log('hotel updated successfully:', updatedhotel);
    res.status(200).json(updatedhotel);           
    } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });   
    }   
});

app.put('/updateroom/:id', verifyToken, async (req, res) => {
  try{
    const roomid=req.params.id;
    const updateroom=req.body;
    const updatedroom=await Room.findByIdAndUpdate(roomid,updateroom,{new:true});
    if(!updatedroom){
        return res.status(401).json({error:'Room not found'});              
    }
    console.log("room updated successfully:", updatedroom);
    res.status(200).json(updatedroom);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({error: 'Internal server error' });  
  }
}
);


// Public endpoints for frontend (no authentication required)
app.get('/accommodations', async (req, res) => {
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
});

app.get('/accommodations/:id', async (req, res) => {
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
    
    console.log('Found accommodation:', accommodation.name || accommodation._id);
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
});

// Public endpoints for frontend (no authentication required)
app.get('/accommodations', async (req, res) => {
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
});

app.get('/accommodations/:id', async (req, res) => {
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
});

  }
});

// Public endpoints for frontend (no authentication required)
app.get('/accommodations', async (req, res) => {
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
});

app.get('/accommodations/:id', async (req, res) => {
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
    
    console.log('Found accommodation:', accommodation.name || accommodation._id);
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
});

// Public endpoints for frontend (no authentication required)
app.get('/accommodations', async (req, res) => {
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
});

app.get('/accommodations/:id', async (req, res) => {
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
});

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      console.log(`🔐 Accommodation service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();