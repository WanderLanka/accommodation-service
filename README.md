# Accommodation Service

A microservice for managing accommodations (hotels, resorts, guesthouses, homestays) and rooms in the WanderLanka travel platform.

## Project Structure

```
accommodation-service/
├── src/
│   ├── controllers/        # Route handlers and business logic
│   │   ├── accommodationController.js
│   │   └── roomController.js
│   ├── models/            # Database schemas and models
│   │   ├── Accommodation.js
│   │   └── Room.js
│   ├── middleware/        # Custom middleware functions
│   │   └── auth.js
│   ├── routes/           # Route definitions
│   │   ├── accommodationRoutes.js
│   │   └── roomRoutes.js
│   ├── config/           # Configuration files
│   │   ├── config.js
│   │   ├── database.js
│   │   └── middleware.js
│   └── utils/            # Utility functions
├── .env                  # Environment variables
├── package.json         # Dependencies and scripts
├── server.js           # Application entry point
└── README.md          # This file
```

## Features

- **Accommodation Management**: Create, read, update accommodations
- **Room Management**: Manage rooms within accommodations
- **JWT Authentication**: Secure endpoints with token verification
- **MongoDB Integration**: Persistent data storage
- **RESTful API**: Clean and consistent API design

## API Endpoints

### Accommodations
- `GET /places` - Get all accommodations for authenticated user
- `GET /hotel/:id` - Get specific accommodation by ID
- `POST /addhotels` - Add new accommodation
- `PUT /updatehotel/:id` - Update accommodation

### Rooms
- `GET /places/:id` - Get rooms by hotel ID
- `GET /rooms/:id` - Get specific room by ID
- `POST /addrooms` - Add new room
- `PUT /updateroom/:id` - Update room

### Health
- `GET /health` - Service health check

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3003
MONGO_URI=mongodb://localhost:27017/test
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Installation & Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the service:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

4. The service will run on `http://localhost:3003`

## Database Schema

### Accommodation
- userId (String, required)
- name (String, required)
- location (String, required)
- accommodationType (Enum: 'hotel', 'resort', 'guesthouse', 'homestay')
- totalRooms (Number, required)
- phone (String, required)
- checkInTime (String, default: '14:00')
- checkOutTime (String, default: '11:00')
- status (Enum: 'active', 'inactive', default: 'active')

### Room
- hotel (ObjectId, ref: 'accommodations', required)
- roomcount (Number)
- availableroomcount (Number)
- type (Enum: 'luxury', 'standard', required)
- isAC (Boolean, default: false)
- maxOccupancy (Number)
- isPetsAllowed (Boolean, default: false)
- pricePerNight (Number, required)
- pricePerDay (Number, required)
- description (String)
- images (Array of Strings)

## Integration

This service integrates with:
- **API Gateway**: Receives requests via proxy from `/api/accommodation/*`
- **Auth Service**: Validates JWT tokens for user authentication
- **Frontend**: Provides accommodation data for booking interfaces

## Development Notes

- All routes except `/health` require JWT authentication
- User identification is done via `req.user.username` from decoded JWT
- CORS is configured for frontend integration
- MongoDB connection uses the 'test' database by default