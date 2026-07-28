import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { createOrderValidator, updateOrderStatusValidator } from '../validators/order.validator.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// User routes
router.post('/', createOrderValidator, validateMiddleware, orderController.placeOrder);
router.get('/', orderController.getMyOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.post('/:orderId/cancel', orderController.cancelMyOrder);

// Admin routes
router.patch(
  '/:orderId/status',
  roleMiddleware(['admin']),
  updateOrderStatusValidator,
  validateMiddleware,
  orderController.updateStatus
);

export default router;
