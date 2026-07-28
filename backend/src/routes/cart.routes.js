/* ==========================================================================
   src/routes/cart.routes.js
   Cart routes mapping endpoints to validators and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  addCartItemValidator,
  editCartItemValidator,
  mergeCartValidator,
} from '../validators/cart.validator.js';
import {
  getMyCart,
  addCartItem,
  editCartItem,
  removeCartItem,
  clearMyCart,
  mergeCart,
} from '../controllers/cart.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getMyCart);
router.post('/items', addCartItemValidator, addCartItem);
router.put('/items/:itemId', editCartItemValidator, editCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearMyCart);
router.post('/merge', mergeCartValidator, mergeCart);

export default router;
