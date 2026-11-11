const { start, installReadiness } = require('./runtime');
const express = require('express');
const connectDB = require('./src/config/database');
const setupMiddleware = require('./src/config/middleware');
const config = require('./src/config/config');

// Import routes
const accommodationRoutes = require('./src/routes/accommodationRoutes');
const roomRoutes = require('./src/routes/roomRoutes');

const app = express();
installReadiness(app);

// Setup middleware
setupMiddleware(app);


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

if (require.main === module) {
  start(app, { connect: connectDB, port: config.port }).catch(error => {
    console.error('Service startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
