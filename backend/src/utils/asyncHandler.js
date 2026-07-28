/* ==========================================================================
   src/utils/asyncHandler.js
   Higher-order function that wraps async route controllers.

   WHY this exists:
   Without asyncHandler, every async controller needs its own try/catch:
     async (req, res, next) => {
       try { ... }
       catch (err) { next(err); }
     }

   With asyncHandler, we write:
     asyncHandler(async (req, res, next) => { ... })

   Any thrown error or rejected promise is automatically forwarded to
   next(err), which triggers the global error.middleware.js handler.

   USAGE:
     import asyncHandler from '../utils/asyncHandler.js';
     export const getProducts = asyncHandler(async (req, res) => {
       const products = await productService.getAll();
       ApiResponse.success(res, 200, 'Products fetched', products);
     });
   ========================================================================== */

/**
 * Wraps an async Express route handler to catch errors and forward them.
 *
 * @param {Function} fn - Async (req, res, next) Express handler
 * @returns {Function}  - Express middleware that auto-catches async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
