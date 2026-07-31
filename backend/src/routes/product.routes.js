/* ==========================================================================
   src/routes/product.routes.js
   Product routes mapping endpoints to validators, roles, and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import {
  createProductValidator,
  updateProductValidator,
} from '../validators/product.validator.js';
import {
  listProducts,
  getProductDetails,
  getRelated,
  addProduct,
  editProduct,
  removeProduct,
} from '../controllers/product.controller.js';
import { ROLES } from '../constants/roles.js';
import { cacheMiddleware } from '../middlewares/cache.middleware.js';

const router = Router();

// Public catalog search and read routes
router.get('/', cacheMiddleware(180), listProducts);
router.get('/:slug/related', getRelated);
router.get('/:slugOrId', getProductDetails);

// Admin-guarded inventory management routes
router.post(
  '/',
  createProductValidator,
  addProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  updateProductValidator,
  editProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  removeProduct
);

export default router;
