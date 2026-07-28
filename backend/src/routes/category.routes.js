/* ==========================================================================
   src/routes/category.routes.js
   Category routes mapping endpoints to validators, roles, and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { brandCategoryValidator } from '../validators/product.validator.js';
import {
  listCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from '../controllers/category.controller.js';
import { ROLES } from '../constants/roles.js';
import { cacheMiddleware } from '../middlewares/cache.middleware.js';

const router = Router();

// Public read endpoints
router.get('/', cacheMiddleware(86400), listCategories);
router.get('/:id', getCategory);

// Admin-guarded modification endpoints
router.post(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  brandCategoryValidator,
  addCategory
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  brandCategoryValidator,
  editCategory
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  removeCategory
);

export default router;
