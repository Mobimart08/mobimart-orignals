/* ==========================================================================
   src/routes/brand.routes.js
   Brand routes mapping endpoints to validators, roles, and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { brandCategoryValidator } from '../validators/product.validator.js';
import {
  listBrands,
  getBrand,
  addBrand,
  editBrand,
  removeBrand,
} from '../controllers/brand.controller.js';
import { ROLES } from '../constants/roles.js';
import { cacheMiddleware } from '../middlewares/cache.middleware.js';

const router = Router();

// Public read endpoints
router.get('/', cacheMiddleware(86400), listBrands);
router.get('/:id', getBrand);

// Admin-guarded modification endpoints
router.post(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  brandCategoryValidator,
  addBrand
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  brandCategoryValidator,
  editBrand
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  removeBrand
);

export default router;
