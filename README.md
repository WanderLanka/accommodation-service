# Accommodation Service

A microservice for managing accommodations (hotels, resorts, guesthouses, homestays) and rooms in the WanderLanka platform. It exposes public browsing endpoints and authenticated provider endpoints, and integrates with booking flows for room availability updates.

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

- **Public Browsing**: List and view accommodations without auth
- **Provider Management**: Create/read/update accommodations and rooms (JWT-protected)
- **Room Availability**: Endpoints to decrease/increase availability for booking flows
- **JWT Authentication**: Secure provider endpoints with token verification
- **MongoDB Integration**: Persistent data storage via Mongoose
- **Gateway Compatibility**: Accepts both direct and `/api/accommodation/*`-prefixed paths

## API Endpoints

Note: When accessed via the API Gateway, routes may be forwarded with the prefix `/api/accommodation/*`. Aliases are provided for compatibility.

### Public (no auth)
- `GET /accommodations` — List all accommodations (public)
- `GET /accommodations/:id` — Get accommodation by ID (public)
- Aliases:
   - `GET /api/accommodation/accommodations`
   - `GET /api/accommodation/accommodations/:id`

### Provider (authenticated)
- `GET /places` — List accommodations for the authenticated provider
- `GET /hotel/:id` — Get provider-specific accommodation details
- `POST /addhotels` — Create a new accommodation
- `PUT /updatehotel/:id` — Update an accommodation
- Aliases:
   - `GET /api/accommodation/places`
   - `GET /api/accommodation/hotel/:id`

### Rooms (authenticated)
- `GET /places/:id` — List rooms by accommodation ID
- `GET /rooms/:id` — Get room by ID
- `POST /addrooms` — Create a room
- `PUT /updateroom/:id` — Update a room

### Availability (internal to booking flows)
- `PUT /accommodations/:id/room-types/decrease` — Decrease available rooms for given types/quantities
- `PUT /accommodations/:id/room-types/increase` — Increase available rooms (e.g., when booking ends)

### Health & Test
- `GET /health` — Service health check
- `GET /test` — Simple test route for connectivity

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3003
MONGO_URI=mongodb://localhost:27017/test
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
HOST=0.0.0.0
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
- **API Gateway**: Proxies requests under `/api/accommodation/*` to this service (path aliases supported)
- **Auth Service**: Validates JWT tokens for provider endpoints (`Authorization: Bearer <token>`)
- **Booking Service**: Calls availability endpoints to adjust room counts during booking lifecycle
- **Frontend**: Provides accommodation data for browsing and provider management

## Development Notes

- Public browsing endpoints do NOT require JWT; provider and rooms endpoints DO.
- CORS is configurable via `CORS_ORIGIN`.
- MongoDB connection string is set via `MONGO_URI`.
- Debug logging prints incoming request details; unmatched routes return structured 404.

## Docker (example)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

FROM node:20-alpine
ENV NODE_ENV=production
USER node
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3003
CMD ["node", "server.js"]
```

```bash
docker build -t accommodation-service:local .
docker run --rm -p 3003:3003 \
   -e MONGO_URI=mongodb://host.docker.internal:27017/accommodation \
   -e JWT_SECRET=your-secret \
   -e CORS_ORIGIN=http://localhost:5173 \
   accommodation-service:local
```