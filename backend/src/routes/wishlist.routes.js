/* ==========================================================================
   src/routes/wishlist.routes.js
   Wishlist routes mapping endpoints to validators and controllers.
   ========================================================================== */

import { Router } from 'express';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import {
  getMyWishlist,
  addWishlistItem,
  removeWishlistItem,
} from '../controllers/wishlist.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getMyWishlist);

router.post(
  '/',
  body('productId').isMongoId().withMessage('Invalid product ID format'),
  validateMiddleware,
  addWishlistItem
);

router.delete('/:productId', removeWishlistItem);

export default router;
