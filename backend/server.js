/* ==========================================================================
   server.js
   Application entry point.
   - Imports and validates environment variables (via env.js)
   - Connects to MongoDB
   - Binds the Express app to a PORT
   - Handles unhandled promise rejections and uncaught exceptions

   This file is responsible ONLY for starting and stopping the server.
   All application logic lives in src/app.js.
   ========================================================================== */

import './src/config/env.js'; // Validate env variables FIRST — before any other import
import app from './src/app.js';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';
import { logger } from './src/utils/logger.js';
import { startCronJobs } from './src/jobs/cronJobs.js';
import { initializeProductCatalogMetadata } from './src/services/catalogBootstrap.service.js';

/* --------------------------------------------------------------------------
   Connect to MongoDB, then start the HTTP server.
   We wait for DB connection before accepting traffic to prevent
   requests from hitting an unconnected database on startup.
   -------------------------------------------------------------------------- */
const startServer = async () => {
  await connectDB();
  await initializeProductCatalogMetadata();

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`🚀 MobiMart API Server Started | Port: ${env.PORT} | Env: ${env.NODE_ENV}`);
    logger.info(`   Health URL: ${env.APP_URL}/api/v1/health`);
    
    // Initialize background cron jobs
    startCronJobs();
  });

  /* -------------------------------------------------------------------------
     Graceful Shutdown Handler
     On SIGTERM (Docker stop, Render scale-down):
     1. Stop accepting new connections
     2. Close existing connections
     3. Disconnect from MongoDB
     4. Exit cleanly with code 0
     ----------------------------------------------------------------------- */
  const shutdown = async (signal) => {
    logger.warn(`⚠️  ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      logger.info('   HTTP server closed.');
      const mongoose = await import('mongoose');
      await mongoose.default.disconnect();
      logger.info('   MongoDB disconnected.');
      logger.info('✅ Graceful shutdown complete.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C in development
};

/* --------------------------------------------------------------------------
   Process-level safety nets.
   These catch errors that escape all try/catch blocks.
   -------------------------------------------------------------------------- */

// Unhandled Promise Rejections
// MongoDB Atlas drops connections transiently — do NOT exit on every rejection.
// Only log and allow the connection to auto-reconnect.
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`⚠️  Unhandled Promise Rejection: ${reason}`);
  // Do NOT call process.exit(1) here — Atlas network blips would kill the server.
  // The MongoDB driver handles reconnection automatically.
});

// Uncaught Exceptions
// (e.g., TypeError, ReferenceError outside async context)
// After an uncaughtException the process is in an UNKNOWN STATE.
// Controlled exit + auto-restart is the only safe option.
process.on('uncaughtException', (err) => {
  logger.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

/* --------------------------------------------------------------------------
   Start the server.
   -------------------------------------------------------------------------- */
startServer();

