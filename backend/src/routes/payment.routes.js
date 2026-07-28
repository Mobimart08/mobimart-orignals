import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import responseLoggerMiddleware from '../middlewares/responseLogger.middleware.js';

const router = Router();

// 9. WEBHOOK endpoint (needs to be before authMiddleware because Razorpay calls it directly without auth)
router.post('/webhook', responseLoggerMiddleware, paymentController.razorpayWebhook);

router.use(authMiddleware);
router.use(responseLoggerMiddleware);

router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);

export default router;
