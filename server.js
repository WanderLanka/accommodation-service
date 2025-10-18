const express = require('express');
const connectDB = require('./src/config/database');
const setupMiddleware = require('./src/config/middleware');
const config = require('./src/config/config');

// Import routes
const accommodationRoutes = require('./src/routes/accommodationRoutes');
const roomRoutes = require('./src/routes/roomRoutes');

const app = express();

// Setup middleware
setupMiddleware(app);

// Routes
app.use('/', accommodationRoutes);
app.use('/', roomRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Accommodation Service',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.port, config.host, () => {
      console.log(`🔐 Accommodation service running on ${config.host}:${config.port}`);
      console.log(`📊 Health check: http://${config.host}:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();