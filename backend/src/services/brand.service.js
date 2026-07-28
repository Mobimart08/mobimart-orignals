/* ==========================================================================
   src/services/brand.service.js
   Brand core logic service.
   Handles creation, listings, updates, and cascading updates.
   ========================================================================== */

import Brand from '../models/Brand.model.js';
import Product from '../models/Product.model.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';

export const getBrands = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return Brand.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
};

export const getBrandById = async (id) => {
  const brand = await Brand.findById(id).lean();
  if (!brand) throw new NotFoundError('Brand not found');
  return brand;
};

export const createBrand = async (brandData) => {
  const slug = slugify(brandData.name);

  // Enforce name uniqueness
  const existing = await Brand.findOne({ slug });
  if (existing) {
    throw new ConflictError(`Brand '${brandData.name}' is already registered`);
  }

  const brand = await Brand.create({
    ...brandData,
    slug,
  });

  return brand;
};

export const updateBrand = async (id, brandData) => {
  const brand = await Brand.findById(id);
  if (!brand) throw new NotFoundError('Brand not found');

  let oldName = brand.name;

  if (brandData.name && brandData.name !== brand.name) {
    const slug = slugify(brandData.name);
    const existing = await Brand.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError(`Brand '${brandData.name}' already exists`);
    }
    brand.name = brandData.name;
    brand.slug = slug;
  }

  const fields = ['description', 'logo', 'logoPublicId', 'country', 'website', 'sortOrder', 'isActive'];
  fields.forEach((f) => {
    if (brandData[f] !== undefined) {
      brand[f] = brandData[f];
    }
  });

  await brand.save();

  // Cascade update denormalized product.brandName copies if brand name changed
  if (brandData.name && brandData.name !== oldName) {
    await Product.updateMany({ brand: id }, { $set: { brandName: brand.name } });
  }

  return brand;
};

export const deleteBrand = async (id) => {
  // Check if any products reference this brand
  const productCount = await Product.countDocuments({ brand: id });
  if (productCount > 0) {
    throw new BadRequestError('Cannot delete brand: products are currently associated with it. Deactivate instead.');
  }

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw new NotFoundError('Brand not found');
};
