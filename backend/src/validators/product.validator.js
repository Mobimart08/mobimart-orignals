/* ==========================================================================
   src/validators/product.validator.js
   Validation constraints for Brands, Categories, and Products requests.
   ========================================================================== */

import { body, param } from 'express-validator';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { PRODUCT_CONDITIONS } from '../constants/productCatalog.js';

const productConditionValidator = body('productCondition')
  .isIn(PRODUCT_CONDITIONS)
  .withMessage(`productCondition must be one of: ${PRODUCT_CONDITIONS.join(', ')}`);

const skuValidator = body('sku')
  .optional({ checkFalsy: true })
  .isString()
  .trim()
  .isLength({ min: 2, max: 40 })
  .withMessage('SKU must be between 2 and 40 characters');

export const brandCategoryValidator = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage('Name must be between 1 and 60 characters'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('logo')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Logo must be a valid URL'),

  body('logoPublicId')
    .optional({ nullable: true })
    .isString()
    .trim(),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('sortOrder must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  validateMiddleware,
];

export const createProductValidator = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),

  skuValidator,

  body('brand')
    .isMongoId()
    .withMessage('Brand must be a valid MongoDB ID'),

  body('category')
    .isMongoId()
    .withMessage('Category must be a valid MongoDB ID'),

  productConditionValidator,

  body('price')
    .isInt({ min: 0 })
    .withMessage('Price must be a positive integer in INR'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('images must be an array containing at least one image details'),

  body('images.*.url')
    .isURL()
    .withMessage('Image path must be a valid URL'),

  body('images.*.publicId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Image publicId is required'),

  body('images.*.isPrimary')
    .optional()
    .isBoolean(),

  body('description')
    .isString()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean(),

  body('isFeatured')
    .optional()
    .isBoolean(),

  validateMiddleware,
];

export const updateProductValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID parameter'),

  body('name').optional().isString().trim().isLength({ min: 2, max: 150 }),
  body('sku').optional().isString().trim().isLength({ min: 2, max: 40 }),
  body('brand').optional().isMongoId(),
  body('category').optional().isMongoId(),
  body('productCondition').optional().isIn(PRODUCT_CONDITIONS),
  body('price').optional().isInt({ min: 0 }),
  body('images').optional().isArray({ min: 1 }),
  body('description').optional().isString().trim().isLength({ min: 20, max: 5000 }),
  body('stock').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),

  validateMiddleware,
];
