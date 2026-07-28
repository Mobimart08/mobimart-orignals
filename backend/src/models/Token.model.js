/* ==========================================================================
   src/models/Token.model.js
   Stores hashed refresh tokens and one-time security tokens.
   TTL index auto-deletes expired documents — no manual cleanup needed.

   Token types:
   - 'refresh'              → 7 days
   - 'password_reset'       → 15 minutes
   - 'email_verification'   → 24 hours

   SECURITY: Raw tokens are NEVER stored. Only SHA-256 hashes.
   If the DB is compromised, no usable tokens are exposed.
   ========================================================================== */

import mongoose from 'mongoose';

const TOKEN_TYPES = ['refresh', 'password_reset', 'email_verification'];

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
    },

    // SHA-256 hash of the actual token — never stored in plain text
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
      select: false, // Never returned in API responses
    },

    type: {
      type: String,
      enum: { values: TOKEN_TYPES, message: '{VALUE} is not a valid token type' },
      required: [true, 'Token type is required'],
    },

    // MongoDB TTL index will auto-delete this document at this timestamp
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },

    // Optional — browser/device info for future session management UI
    userAgent: {
      type: String,
      default: null,
      maxlength: 300,
    },

    // Optional — IP at creation time for security audit
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* --------------------------------------------------------------------------
   Indexes

   TTL Index: expireAfterSeconds: 0 means MongoDB deletes the document
   at EXACTLY the `expiresAt` timestamp (checked every ~60 seconds).

   userId + type compound: fast revocation of all tokens of one type
   (e.g., delete all refresh tokens on password reset).

   tokenHash + type compound: fast lookup during token verification.
   -------------------------------------------------------------------------- */
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ tokenHash: 1, type: 1 });

const Token = mongoose.model('Token', tokenSchema);

export default Token;
