/* ==========================================================================
   src/config/db.js
   MongoDB connection setup using Mongoose.
   Connection options, error handling, and graceful disconnect on shutdown.
   ========================================================================== */

import mongoose from 'mongoose';
import env from './env.js';

/**
 * Establishes connection to MongoDB Atlas via Mongoose.
 * Exits the process on fatal connection failure.
 */
const connectDB = async () => {
  try {
    let uri = env.MONGODB_URI;
    
    // Some users leave the <password> brackets or use special characters in the password.
    // If we find < >, we extract the password, URI encode it, and rebuild the connection string.
    if (uri.includes('<') && uri.includes('>')) {
      const start = uri.indexOf('<');
      const end = uri.indexOf('>');
      const rawPassword = uri.substring(start + 1, end);
      const encodedPassword = encodeURIComponent(rawPassword);
      uri = uri.substring(0, start) + encodedPassword + uri.substring(end + 1);
    }

    const connection = await mongoose.connect(uri, {
      // Connection pool — max 10 connections per server instance
      maxPoolSize: 10,

      // Timeouts (milliseconds)
      connectTimeoutMS: 10000,        // 10s to establish initial connection
      serverSelectionTimeoutMS: 5000, // 5s to select a server
      socketTimeoutMS: 45000,         // 45s for an operation to complete

      // Auto-retry failed write operations (MongoDB Atlas default)
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    console.log(`   Database: ${connection.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Halt — app cannot function without a database
  }
};

/* --------------------------------------------------------------------------
   Mongoose global event listeners for monitoring connection health.
   -------------------------------------------------------------------------- */
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});

export default connectDB;
