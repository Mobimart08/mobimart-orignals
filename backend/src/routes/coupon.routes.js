import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller.js';
import { createCouponValidator, applyCouponValidator } from '../validators/coupon.validator.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

// Public / User routes
router.post('/apply', authMiddleware, applyCouponValidator, validateMiddleware, couponController.applyCoupon);

// Admin routes
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/', createCouponValidator, validateMiddleware, couponController.createCoupon);
router.get('/', couponController.getCoupons);

export default router;
