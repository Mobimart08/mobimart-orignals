/* ==========================================================================
   src/routes/address.routes.js
   Address routes mapping endpoints to validators, middlewares, and controllers.
   ========================================================================== */

import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { addressValidator } from '../validators/address.validator.js';
import {
  listAddresses,
  addAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
} from '../controllers/address.controller.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', listAddresses);
router.post('/', addressValidator, addAddress);
router.put('/:id', addressValidator, editAddress);
router.delete('/:id', removeAddress);
router.put('/:id/default', makeDefaultAddress);

export default router;
