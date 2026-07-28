/* ==========================================================================
   src/services/category.service.js
   Category core logic service.
   Handles creation, listings, updates, and cascading updates.
   ========================================================================== */

import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';

export const getCategories = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id).lean();
  if (!category) throw new NotFoundError('Category not found');
  return category;
};

export const createCategory = async (categoryData) => {
  const slug = slugify(categoryData.name);

  // Enforce name uniqueness
  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ConflictError(`Category '${categoryData.name}' already exists`);
  }

  // If parentCategory is provided, verify it exists and is not self
  if (categoryData.parentCategory) {
    const parent = await Category.findById(categoryData.parentCategory);
    if (!parent) {
      throw new BadRequestError('Parent category does not exist');
    }
  }

  const category = await Category.create({
    ...categoryData,
    slug,
  });

  return category;
};

export const updateCategory = async (id, categoryData) => {
  const category = await Category.findById(id);
  if (!category) throw new NotFoundError('Category not found');

  let oldName = category.name;

  if (categoryData.name && categoryData.name !== category.name) {
    const slug = slugify(categoryData.name);
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError(`Category '${categoryData.name}' already exists`);
    }
    category.name = categoryData.name;
    category.slug = slug;
  }

  // Prevent self-parent reference
  if (categoryData.parentCategory) {
    if (categoryData.parentCategory.toString() === id.toString()) {
      throw new BadRequestError('Category cannot be its own parent');
    }
    const parent = await Category.findById(categoryData.parentCategory);
    if (!parent) {
      throw new BadRequestError('Parent category does not exist');
    }
    category.parentCategory = categoryData.parentCategory;
  }

  const fields = ['description', 'image', 'imagePublicId', 'sortOrder', 'isActive'];
  fields.forEach((f) => {
    if (categoryData[f] !== undefined) {
      category[f] = categoryData[f];
    }
  });

  await category.save();

  // Cascade update denormalized product.categoryName copies if category name changed
  if (categoryData.name && categoryData.name !== oldName) {
    await Product.updateMany({ category: id }, { $set: { categoryName: category.name } });
  }

  return category;
};

export const deleteCategory = async (id) => {
  // Check if any products reference this category
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new BadRequestError('Cannot delete category: products are currently associated with it. Deactivate instead.');
  }

  // Check if any subcategories reference this category
  const subCategoryCount = await Category.countDocuments({ parentCategory: id });
  if (subCategoryCount > 0) {
    throw new BadRequestError('Cannot delete category: subcategories reference it.');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new NotFoundError('Category not found');
};
