/**
 * Migration: Cleanup — remove orphaned `colors` and `storage` fields.
 *
 * Context:
 * These fields were added as duplicates and have now been removed from the schema.
 * This script uses $unset to purge them from every product document in MongoDB.
 *
 * Safe rules:
 * - Does NOT touch storageOptions, colorOptions, or ram.
 * - Idempotent: safe to run multiple times.
 *
 * Run once: node migrate_cleanup_duplicate_fields.js
 */

import connectDB from './src/config/db.js';
import Product from './src/models/Product.model.js';

const run = async () => {
  await connectDB();

  const result = await Product.updateMany(
    { $or: [{ colors: { $exists: true } }, { storage: { $exists: true } }] },
    { $unset: { colors: '', storage: '' } }
  );

  console.log('=== Cleanup Migration Complete ===');
  console.log(`Removed orphaned fields from: ${result.modifiedCount} documents`);
  console.log('Fields removed: colors, storage');
  console.log('Fields preserved: storageOptions, colorOptions, ram');
  console.log('=================================');

  process.exit(0);
};

run().catch((err) => {
  console.error('Cleanup migration failed:', err);
  process.exit(1);
});
