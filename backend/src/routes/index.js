/* ==========================================================================
   src/routes/index.js
   Central route aggregator — registers all route modules under /api/v1.
   This file is the ONLY place routes are mounted.
   Routes are imported here as they are built phase by phase.
   ========================================================================== */

import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import addressRoutes from './address.routes.js';
import brandRoutes from './brand.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import uploadRoutes from './upload.routes.js';
import cartRoutes from './cart.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import couponRoutes from './coupon.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './review.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import paymentRoutes from './payment.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

/* --------------------------------------------------------------------------
   Health Check — confirms the API is alive.
   No auth required. Used by load balancers and monitoring tools.
   -------------------------------------------------------------------------- */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MobiMart API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mounted API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/addresses', addressRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/upload', uploadRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/coupons', couponRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/search', searchRoutes);

export default router;
