import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes.js';

export const createNotification = async ({ userId, type, title, message, link, metadata }) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    link,
    metadata,
  });
  return notification;
};

export const getUserNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Notification.countDocuments({ userId });

  return {
    notifications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return { count };
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  return notification;
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }
};

export const broadcastNotification = async ({ title, message, type = NOTIFICATION_TYPES.PROMOTION, link, targetUsers }) => {
  let userIds = targetUsers;

  // If no target users provided, broadcast to all active customers
  if (!userIds || userIds.length === 0) {
    const users = await User.find({ isActive: true, role: 'customer' }).select('_id');
    userIds = users.map(u => u._id);
  }

  const notifications = userIds.map(userId => ({
    userId,
    type,
    title,
    message,
    link,
  }));

  if (notifications.length > 0) {
    // Perform bulk insert
    await Notification.insertMany(notifications, { ordered: false });
  }

  return {
    success: true,
    recipientsCount: notifications.length,
  };
};
