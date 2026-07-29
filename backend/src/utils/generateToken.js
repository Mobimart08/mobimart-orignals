/* ==========================================================================
   src/utils/generateToken.js
   JWT sign/verify helpers + cryptographic token utilities.

   All token operations go through this module — never call jwt.sign/verify
   directly in services or controllers.
   ========================================================================== */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

/* --------------------------------------------------------------------------
   JWT — Access Token
   Short-lived (15min). Transmitted as Authorization: Bearer header.
   Payload: { userId, role }
   -------------------------------------------------------------------------- */

/**
 * Signs a new access token.
 * @param {string} userId  - MongoDB user ObjectId (string)
 * @param {string} role    - User role ('customer' | 'admin' | 'super_admin')
 * @returns {string}       - Signed JWT
 */
export const signAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
};

/**
 * Verifies an access token and returns the decoded payload.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 * @param {string} token
 * @returns {{ userId: string, role: string, iat: number, exp: number }}
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/* --------------------------------------------------------------------------
   JWT — Refresh Token
   Long-lived. Stored in HttpOnly cookie.
   Payload: { userId, rememberMe } — minimal payload, no role (re-fetched from DB)

   rememberMe=true  → 30 days
   rememberMe=false → env.JWT_REFRESH_EXPIRES_IN (default: 7d)
   -------------------------------------------------------------------------- */

/**
 * Signs a new refresh token.
 * @param {string}  userId     - MongoDB user ObjectId
 * @param {boolean} rememberMe - Whether to issue a long-lived (30d) token
 * @returns {string} - Signed JWT
 */
export const signRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verifies a refresh token and returns the decoded payload.
 * @param {string} token
 * @returns {{ userId: string, rememberMe: boolean, iat: number, exp: number }}
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/* --------------------------------------------------------------------------
   Cryptographic Utilities
   -------------------------------------------------------------------------- */

/**
 * Hashes a token string using SHA-256.
 * Used to safely store token representations in the database.
 *
 * @param {string} token - Raw token string (JWT or random hex)
 * @returns {string}     - Hex-encoded SHA-256 hash
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generates a cryptographically secure random token.
 * Used for email verification and password reset tokens.
 *
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {string}     - Hex-encoded random token (64 chars for 32 bytes)
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Computes the DB expiry date for a refresh token.
 * Mirrors the JWT expiry so the DB TTL matches the cookie/JWT lifetime.
 *
 * @param {boolean} rememberMe
 * @returns {Date}
 */
export const getRefreshTokenExpiry = () => {
  const ms = 7 * 24 * 60 * 60 * 1000;  // 7 days
  return new Date(Date.now() + ms);
};

/**
 * Sets the refresh token as an HttpOnly cookie on the response.
 * Centralizes all cookie config in one place.
 *
 * @param {Object} res          - Express response object
 * @param {string} refreshToken - The raw refresh token JWT
 */
export const setRefreshTokenCookie = (res, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,                                         // Not accessible via JS — XSS protection
    secure: env.IS_PRODUCTION,                              // HTTPS only in production
    sameSite: env.IS_PRODUCTION ? 'none' : 'lax',           // 'none' required for cross-domain
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,                        // Persistent cookie — survives browser restart (7 days)
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
};

/**
 * Clears the refresh token cookie.
 * Called on logout and password reset.
 *
 * @param {Object} res - Express response object
 */
export const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: env.IS_PRODUCTION ? 'none' : 'lax',
    maxAge: 0,  // Expires immediately
    path: '/',
  });
};
