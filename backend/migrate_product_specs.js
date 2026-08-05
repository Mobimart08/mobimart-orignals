/**
 * Migration: Populate default colors, storage, and ram for existing products
 *
 * Safe rules:
 * - Only updates products where the field is missing OR is an empty array.
 * - Does NOT overwrite any product that already has values for these fields.
 * - Uses updateMany with $set only on documents that lack the field.
 *
 * Run once: node migrate_product_specs.js
 */

import connectDB from './src/config/db.js';
import Product from './src/models/Product.model.js';

const run = async () => {
  await connectDB();

  const defaultColors = ['Black'];
  const defaultStorage = ['128GB'];
  const defaultRam = ['8GB'];

  // Find products missing colors (field absent or empty array)
  const colorResult = await Product.updateMany(
    { $or: [{ colors: { $exists: false } }, { colors: { $size: 0 } }] },
    { $set: { colors: defaultColors } }
  );

  // Find products missing storage (field absent or empty array)
  const storageResult = await Product.updateMany(
    { $or: [{ storage: { $exists: false } }, { storage: { $size: 0 } }] },
    { $set: { storage: defaultStorage } }
  );

  // Find products missing ram (field absent or empty array)
  const ramResult = await Product.updateMany(
    { $or: [{ ram: { $exists: false } }, { ram: { $size: 0 } }] },
    { $set: { ram: defaultRam } }
  );

  console.log('=== Migration Complete ===');
  console.log(`Colors applied to: ${colorResult.modifiedCount} products`);
  console.log(`Storage applied to: ${storageResult.modifiedCount} products`);
  console.log(`RAM applied to: ${ramResult.modifiedCount} products`);
  console.log('=========================');

  process.exit(0);
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
