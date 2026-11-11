// Legacy entrypoint: use the same application and lifecycle as npm start.
const app = require('./server');
const { start } = require('./runtime');
const connectDB = require('./src/config/database');
const config = require('./src/config/config');

if (require.main === module) {
  start(app, { connect: connectDB, port: config.port }).catch(error => {
    console.error('Service startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
