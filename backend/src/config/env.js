/* ==========================================================================
   src/config/env.js
   Centralized environment variable loader and startup validator.
   The server WILL NOT START if any required variable is missing.
   This prevents silent misconfigurations in production.
   ========================================================================== */

import dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

/* --------------------------------------------------------------------------
   Required environment variables.
   Add any new required variable here — the validator will catch it at boot.
   -------------------------------------------------------------------------- */
const REQUIRED_VARS = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'FRONTEND_URL',
  'RESEND_API_KEY',
];

// In production, enforce Cloudinary, Razorpay, and explicit URLs
if (process.env.NODE_ENV === 'production') {
  REQUIRED_VARS.push(
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'APP_URL'
  );
}

/**
 * Validates all required environment variables are present.
 * Throws a descriptive error and halts startup if any are missing.
 */
const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ FATAL: Missing required environment variables:');
    missing.forEach((key) => console.error(`   → ${key}`));
    console.error('\nCopy .env.example to .env and fill in all values.\n');
    process.exit(1);
  }
};

validateEnv();

/* --------------------------------------------------------------------------
   Centralized config object — import this anywhere instead of
   accessing process.env directly throughout the codebase.
   -------------------------------------------------------------------------- */
const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'MobiMart <noreply@mobimartoriginals.com>',

  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [
        'https://mobimartoriginals.com',
        'https://www.mobimartoriginals.com',
      ],

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  AUTH_RATE_LIMIT_ENABLED: process.env.AUTH_RATE_LIMIT_ENABLED !== undefined 
    ? process.env.AUTH_RATE_LIMIT_ENABLED === 'true'
    : process.env.NODE_ENV !== 'development',

  // Redis (future)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Razorpay (future)
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,

  // Admin Seed
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe@123',

  // App
  APP_NAME: process.env.APP_NAME || 'MobiMart',
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
};

export default env;
