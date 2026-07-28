import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { broadcastNotificationValidator } from '../validators/notification.validator.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

// All notification routes require authentication
router.use(authMiddleware);

// User routes
router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin routes
router.post(
  '/admin/broadcast',
  roleMiddleware(['admin']),
  broadcastNotificationValidator,
  validateMiddleware,
  notificationController.broadcastNotification
);

export default router;
