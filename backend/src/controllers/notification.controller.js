import * as notificationService from '../services/notification.service.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await notificationService.getUserNotifications(userId, req.query);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await notificationService.getUnreadCount(userId);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    
    const notification = await notificationService.markAsRead(notificationId, userId);
    
    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await notificationService.markAllAsRead(userId);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notificationId = req.params.id;
    
    await notificationService.deleteNotification(notificationId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const broadcastNotification = async (req, res, next) => {
  try {
    const result = await notificationService.broadcastNotification(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Broadcast successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
