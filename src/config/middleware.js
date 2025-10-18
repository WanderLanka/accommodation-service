const express = require('express');
const cors = require('cors');
const config = require('./config');

const setupMiddleware = (app) => {
  // CORS middleware
  app.use(cors(config.cors));
  
  // JSON parsing middleware
  app.use(express.json());

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Authorization header:', req.headers.authorization);
    next();
  });
};

module.exports = setupMiddleware;