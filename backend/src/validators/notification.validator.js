import { body } from 'express-validator';

export const broadcastNotificationValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Notification title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Notification message is required')
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
  body('type')
    .optional()
    .isIn(['order_update', 'promotion', 'system', 'review_response'])
    .withMessage('Invalid notification type'),
  body('link')
    .optional({ nullable: true })
    .isString()
    .withMessage('Link must be a string'),
  body('targetUsers')
    .optional()
    .isArray()
    .withMessage('targetUsers must be an array of user IDs'),
];
