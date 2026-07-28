/* ==========================================================================
   src/services/product.service.js
   Product core logic service.
   Handles listings with filtering, search, pagination, and admin inventory queries.
   ========================================================================== */

import Product from '../models/Product.model.js';
import Brand from '../models/Brand.model.js';
import Category from '../models/Category.model.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';
import {
  deriveConditionType,
  deriveLegacyConditionLabel,
  deriveProductCondition,
} from '../utils/productMetadata.js';

const PRODUCT_CONDITION_VALUES = ['New', 'Refurbished', 'Used', 'Open Box'];

const normalizeCondition = (value, fallback = null) => {
  if (!value) {
    return fallback;
  }

  if (PRODUCT_CONDITION_VALUES.includes(value)) {
    return value;
  }

  if (value === 'Brand New - Sealed') return 'New';
  if (value === 'Certified Like New') return 'Refurbished';
  if (['Excellent', 'Very Good', 'Good'].includes(value)) return 'Used';
  if (value === 'Open Box') return 'Open Box';

  if (value === 'conditionType:New' || value === 'New') return 'New';
  if (value === 'conditionType:Used' || value === 'Used') return 'Used';

  return fallback;
};

const normalizeProductPayload = (payload = {}) => {
  const productCondition = normalizeCondition(
    payload.productCondition || payload.conditionType || payload.condition,
    'New'
  );

  const normalizedSlug = slugify(payload.slug || payload.name || '');
  const normalizedSku = payload.sku ? String(payload.sku).trim().toUpperCase() : undefined;

  return {
    ...payload,
    ...(normalizedSlug ? { slug: normalizedSlug } : {}),
    ...(normalizedSku ? { sku: normalizedSku } : {}),
    productCondition,
    conditionType: deriveConditionType(productCondition),
    condition: deriveLegacyConditionLabel(productCondition, payload.condition),
  };
};

const ensureReferencedDocuments = async (payload) => {
  const [brand, category] = await Promise.all([
    Brand.findById(payload.brand),
    Category.findById(payload.category),
  ]);

  if (!brand) throw new BadRequestError('Associated Brand does not exist');
  if (!category) throw new BadRequestError('Associated Category does not exist');

  return { brand, category };
};

const ensureUniqueProductFields = async ({ slug, sku, excludeId = null }) => {
  if (slug) {
    const existingSlug = await Product.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (existingSlug) {
      throw new ConflictError(`Product slug '${slug}' already exists`);
    }
  }

  if (sku) {
    const existingSku = await Product.findOne({ sku, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (existingSku) {
      throw new ConflictError(`SKU '${sku}' is already assigned to another product`);
    }
  }
};

const ensurePrimaryImage = (images = []) => {
  if (!Array.isArray(images) || images.length === 0) {
    return images;
  }

  const hasPrimary = images.some((img) => img.isPrimary === true);
  if (!hasPrimary) {
    images[0].isPrimary = true;
  }

  return images;
};

const buildPublicProductQuery = async (queryParams) => {
  const {
    q,
    brand,
    category,
    productCondition,
    conditionType,
    condition,
    minPrice,
    maxPrice,
    minBattery,
    minRating,
    certified,
    inStock,
  } = queryParams;

  const mongoQuery = { isActive: true };

  if (q) {
    mongoQuery.$text = { $search: q };
  }

  if (brand) {
    const brandTokens = String(brand).split(',').map((item) => item.trim()).filter(Boolean);
    const brandSlugs = brandTokens.map((item) => slugify(item));
    const brands = await Brand.find({
      isActive: true,
      $or: [
        { slug: { $in: brandSlugs } },
        { name: { $in: brandTokens } },
      ],
    });
    mongoQuery.brand = { $in: brands.map((item) => item._id) };
  }

  if (category) {
    const categoryTokens = String(category).split(',').map((item) => item.trim()).filter(Boolean);
    const categorySlugs = categoryTokens.map((item) => slugify(item));
    const categories = await Category.find({
      isActive: true,
      $or: [
        { slug: { $in: categorySlugs } },
        { name: { $in: categoryTokens } },
      ],
    });
    mongoQuery.category = { $in: categories.map((item) => item._id) };
  }

  const resolvedCondition = normalizeCondition(productCondition || condition || conditionType);
  if (resolvedCondition) {
    mongoQuery.productCondition = resolvedCondition;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    mongoQuery.price = {};
    if (minPrice !== undefined) mongoQuery.price.$gte = parseInt(minPrice, 10);
    if (maxPrice !== undefined) mongoQuery.price.$lte = parseInt(maxPrice, 10);
  }

  if (minBattery) {
    mongoQuery.batteryHealth = { $gte: parseInt(minBattery, 10) };
  }

  if (minRating) {
    mongoQuery.averageRating = { $gte: parseFloat(minRating) };
  }

  if (certified === 'true') {
    mongoQuery.certified = true;
  }

  if (inStock === 'true') {
    mongoQuery.stock = { $gt: 0 };
  }

  return mongoQuery;
};

const buildAdminProductQuery = async (queryParams) => {
  const {
    q,
    brand,
    category,
    productCondition,
    stockStatus,
    minPrice,
    maxPrice,
    status,
  } = queryParams;

  const mongoQuery = {};

  if (q) {
    const searchRegex = new RegExp(q.trim(), 'i');
    mongoQuery.$or = [
      { name: searchRegex },
      { brandName: searchRegex },
      { sku: searchRegex },
    ];
  }

  if (brand) {
    mongoQuery.brand = brand;
  }

  if (category) {
    mongoQuery.category = category;
  }

  const resolvedCondition = normalizeCondition(productCondition);
  if (resolvedCondition) {
    mongoQuery.productCondition = resolvedCondition;
  }

  if (stockStatus === 'in_stock') {
    mongoQuery.stock = { $gt: 0 };
  }

  if (stockStatus === 'low_stock') {
    mongoQuery.$expr = { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', '$lowStockThreshold'] }] };
  }

  if (stockStatus === 'out_of_stock') {
    mongoQuery.stock = 0;
  }

  if (status === 'published') {
    mongoQuery.isActive = true;
  }

  if (status === 'draft') {
    mongoQuery.isActive = false;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    mongoQuery.price = {};
    if (minPrice !== undefined) mongoQuery.price.$gte = parseInt(minPrice, 10);
    if (maxPrice !== undefined) mongoQuery.price.$lte = parseInt(maxPrice, 10);
  }

  return mongoQuery;
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('brand category').lean();
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isActive: true }).populate('brand category').lean();
  if (!product) throw new NotFoundError('Product not found');
  return product;
};

export const getRelatedProducts = async (slug, limit = 4) => {
  const currentProduct = await Product.findOne({ slug, isActive: true });
  if (!currentProduct) throw new NotFoundError('Product not found');

  return Product.find({
    _id: { $ne: currentProduct._id },
    brand: currentProduct.brand,
    isActive: true,
  })
    .limit(limit)
    .populate('brand category')
    .lean();
};

export const createProduct = async (productData) => {
  const normalizedPayload = normalizeProductPayload(productData);
  const { brand, category } = await ensureReferencedDocuments(normalizedPayload);

  await ensureUniqueProductFields({
    slug: normalizedPayload.slug,
    sku: normalizedPayload.sku,
  });

  const product = await Product.create({
    ...normalizedPayload,
    images: ensurePrimaryImage(normalizedPayload.images || []),
    brandName: brand.name,
    categoryName: category.name,
  });

  return product;
};

export const updateProduct = async (id, productData) => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');

  const normalizedPayload = normalizeProductPayload({ ...product.toObject(), ...productData });

  await ensureUniqueProductFields({
    slug: normalizedPayload.slug,
    sku: normalizedPayload.sku,
    excludeId: id,
  });

  if (productData.brand && productData.brand.toString() !== product.brand.toString()) {
    const brand = await Brand.findById(productData.brand);
    if (!brand) throw new BadRequestError('Associated Brand does not exist');
    product.brand = productData.brand;
    product.brandName = brand.name;
  }

  if (productData.category && productData.category.toString() !== product.category.toString()) {
    const category = await Category.findById(productData.category);
    if (!category) throw new BadRequestError('Associated Category does not exist');
    product.category = productData.category;
    product.categoryName = category.name;
  }

  const basicFields = [
    'name',
    'slug',
    'sku',
    'productCondition',
    'conditionType',
    'condition',
    'certified',
    'batteryHealth',
    'price',
    'images',
    'description',
    'specifications',
    'stock',
    'isActive',
    'isFeatured',
    'status',
    'availabilityStatus',
    'visibility',
  ];

  basicFields.forEach((field) => {
    if (normalizedPayload[field] !== undefined) {
      product[field] = field === 'images'
        ? ensurePrimaryImage(normalizedPayload[field])
        : normalizedPayload[field];
    }
  });

  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new NotFoundError('Product not found');

  product.isActive = false;
  await product.save();
};

export const queryProducts = async (queryParams) => {
  const { q, limit = 12, cursor, page, sort } = queryParams;
  const mongoQuery = await buildPublicProductQuery(queryParams);

  let mongoSort = { createdAt: -1 };
  if (q) {
    mongoSort = { score: { $meta: 'textScore' } };
  }

  if (sort) {
    switch (sort) {
      case 'price_asc':
        mongoSort = { price: 1, _id: 1 };
        break;
      case 'price_desc':
        mongoSort = { price: -1, _id: 1 };
        break;
      case 'rating':
        mongoSort = { averageRating: -1, _id: 1 };
        break;
      case 'popularity':
        mongoSort = { reviewCount: -1, _id: 1 };
        break;
      case 'newest':
        mongoSort = { createdAt: -1, _id: 1 };
        break;
    }
  }

  const parsedLimit = parseInt(limit, 10);

  if (page) {
    const parsedPage = parseInt(page, 10) || 1;
    const skip = (parsedPage - 1) * parsedLimit;

    const [totalCount, data] = await Promise.all([
      Product.countDocuments(mongoQuery),
      Product.find(mongoQuery)
        .sort(mongoSort)
        .skip(skip)
        .limit(parsedLimit)
        .populate('brand category')
        .lean(),
    ]);

    return {
      type: 'offset',
      data,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / parsedLimit),
        totalCount,
        hasMore: parsedPage * parsedLimit < totalCount,
      },
    };
  }

  if (cursor) {
    mongoQuery._id = { $gt: cursor };
  }

  const data = await Product.find(mongoQuery)
    .sort(mongoSort)
    .limit(parsedLimit + 1)
    .populate('brand category')
    .lean();

  const hasMore = data.length > parsedLimit;
  if (hasMore) {
    data.pop();
  }

  return {
    type: 'cursor',
    data,
    pagination: {
      nextCursor: data.length > 0 ? data[data.length - 1]._id : null,
      hasMore,
      totalCount: await Product.countDocuments(mongoQuery),
    },
  };
};

export const queryAdminProducts = async (queryParams) => {
  const { page = 1, limit = 20, sort = 'newest' } = queryParams;
  const mongoQuery = await buildAdminProductQuery(queryParams);

  let mongoSort = { createdAt: -1 };
  if (sort === 'price_asc') mongoSort = { price: 1, _id: 1 };
  if (sort === 'price_desc') mongoSort = { price: -1, _id: 1 };
  if (sort === 'stock_asc') mongoSort = { stock: 1, _id: 1 };
  if (sort === 'stock_desc') mongoSort = { stock: -1, _id: 1 };
  if (sort === 'name_asc') mongoSort = { name: 1, _id: 1 };

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const [totalCount, data] = await Promise.all([
    Product.countDocuments(mongoQuery),
    Product.find(mongoQuery)
      .sort(mongoSort)
      .skip(skip)
      .limit(parsedLimit)
      .populate('brand category')
      .lean(),
  ]);

  return {
    data,
    pagination: {
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
      totalCount,
      hasMore: parsedPage * parsedLimit < totalCount,
    },
  };
};

