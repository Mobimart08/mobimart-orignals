/* ==========================================================================
   src/models/Settings.model.js
   Mongoose schema for Site-Wide Admin Settings.
   ========================================================================== */

import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Settings key is required'],
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Settings value is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required for admin context'],
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/* --------------------------------------------------------------------------
   Indexes
   -------------------------------------------------------------------------- */
// Indexes handled by field definitions

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
