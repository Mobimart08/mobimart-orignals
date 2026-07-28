import Brand from '../models/Brand.model.js';
import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import { DEFAULT_BRANDS, DEFAULT_CATEGORIES } from '../constants/productCatalog.js';
import {
  buildDefaultSku,
  deriveConditionType,
  deriveLegacyConditionLabel,
  deriveProductCondition,
} from '../utils/productMetadata.js';
import { slugify } from '../utils/slugify.js';

let bootstrapPromise = null;

const buildUpserts = (items) => items.map((name, index) => ({
  updateOne: {
    filter: { slug: slugify(name) },
    update: {
      $setOnInsert: {
        name,
        slug: slugify(name),
        isActive: true,
        sortOrder: index,
      },
    },
    upsert: true,
  },
}));

const buildProductBackfill = async () => {
  const products = await Product.find({
    $or: [
      { productCondition: { $exists: false } },
      { sku: { $exists: false } },
      { conditionType: { $exists: false } },
      { condition: { $exists: false } },
    ],
  }).lean();

  if (products.length === 0) {
    return;
  }

  const operations = products.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: {
        $set: {
          productCondition: deriveProductCondition(product),
          conditionType: deriveConditionType(deriveProductCondition(product)),
          condition: deriveLegacyConditionLabel(deriveProductCondition(product), product.condition),
          sku: product.sku || buildDefaultSku(product),
        },
      },
    },
  }));

  await Product.bulkWrite(operations);
};

export const initializeProductCatalogMetadata = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await Brand.bulkWrite(buildUpserts(DEFAULT_BRANDS), { ordered: false });
      await Category.bulkWrite(buildUpserts(DEFAULT_CATEGORIES), { ordered: false });
      await buildProductBackfill();
    })().finally(() => {
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
};
