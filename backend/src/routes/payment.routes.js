import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);

export default router;
