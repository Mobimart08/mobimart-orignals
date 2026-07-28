/* ==========================================================================
   src/models/Notification.model.js
   Mongoose schema for In-App User Notifications.
   ========================================================================== */

import mongoose from 'mongoose';
import { NOTIFICATION_TYPES_VALUES } from '../constants/notificationTypes.js';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: NOTIFICATION_TYPES_VALUES,
        message: '{VALUE} is not a valid notification type',
      },
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
      default: null, // Deep link URL (e.g., /orders/MM123)
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Flexible object for arbitrary data (e.g., { orderId: '...' })
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
// Compound index for efficiently fetching unread badge count for a user
notificationSchema.index({ userId: 1, isRead: 1 });
// Index for sorting notifications by newest first
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
