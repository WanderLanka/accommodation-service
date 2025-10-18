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


// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`🔍 Received ${req.method} request to: ${req.path}`);
  console.log(`🔍 Full URL: ${req.url}`);
  console.log(`🔍 Original URL: ${req.originalUrl}`);
  console.log(`🔍 Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working', path: req.path, originalUrl: req.originalUrl });
});

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

// Catch-all route for debugging (must be last)
app.use('*', (req, res) => {
  console.log(`❌ Unmatched route: ${req.method} ${req.originalUrl}`);
  console.log(`❌ Path: ${req.path}`);
  console.log(`❌ Params:`, req.params);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
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