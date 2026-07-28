import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { createReviewValidator, updateReviewValidator } from '../validators/review.validator.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.put('/:id/helpful', reviewController.markReviewHelpful); // Could be protected to prevent spam, but public for now

// Protected user routes
router.use(authMiddleware);

router.post('/', createReviewValidator, validateMiddleware, reviewController.submitReview);
router.put('/:id', updateReviewValidator, validateMiddleware, reviewController.updateMyReview);
router.delete('/:id', reviewController.deleteMyReview);

// Admin routes
router.use(roleMiddleware(['admin']));

router.get('/admin/all', reviewController.getAllReviews);
router.put('/admin/:id/approve', reviewController.approveReview);
router.delete('/admin/:id', reviewController.deleteReviewAdmin);

export default router;
