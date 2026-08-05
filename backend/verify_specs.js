/**
 * End-to-end verification: Create and Edit product spec fields.
 * Traces exact payloads through normalizeProductPayload → Product.create / findById → updateProduct.
 */

import connectDB from './src/config/db.js';
import { createProduct, updateProduct, getProductById } from './src/services/product.service.js';
import Product from './src/models/Product.model.js';
import Brand from './src/models/Brand.model.js';
import Category from './src/models/Category.model.js';

const run = async () => {
  await connectDB();

  // ── Fetch any real brand and category from the DB ──────────────────────────
  const brand = await Brand.findOne({}).lean();
  const category = await Category.findOne({}).lean();

  if (!brand || !category) {
    console.error('No brand or category found in DB. Seed first.');
    process.exit(1);
  }

  console.log('\n================================================');
  console.log('STEP 1: Simulate CREATE payload from admin form');
  console.log('================================================');

  const createPayload = {
    name: '__VERIFY_SPECS_TEST__',
    description: 'Verification test product for spec fields. Do not keep this.',
    brand: brand._id,
    category: category._id,
    productCondition: 'New',
    price: 99999,
    stock: 10,
    status: 'Draft',
    availabilityStatus: 'Active',
    images: [{ url: 'https://example.com/img.jpg', publicId: 'verify_test_img', isPrimary: true }],
    // Simulated admin input after ColorTagInput and TagInput processing:
    colorOptions: [
      { name: 'Black', hexValue: '#000000' },
      { name: 'Blue', hexValue: '#3B5BDB' },
    ],
    storageOptions: ['128GB', '256GB', '512GB'],
    ram: ['8GB', '12GB'],
  };

  console.log('\n📤 Payload sent to createProduct():');
  console.log(JSON.stringify({
    colorOptions: createPayload.colorOptions,
    storageOptions: createPayload.storageOptions,
    ram: createPayload.ram,
  }, null, 2));

  const created = await createProduct(createPayload);

  console.log('\n✅ Product created. Reading back from MongoDB:');
  console.log('colorOptions:', JSON.stringify(created.colorOptions, null, 2));
  console.log('storageOptions:', JSON.stringify(created.storageOptions, null, 2));
  console.log('ram:', JSON.stringify(created.ram, null, 2));

  // Verify types
  const colorOk = Array.isArray(created.colorOptions) && created.colorOptions.every(c => c.name && c.hexValue);
  const storageOk = Array.isArray(created.storageOptions) && created.storageOptions.every(s => typeof s === 'string');
  const ramOk = Array.isArray(created.ram) && created.ram.every(r => typeof r === 'string');

  console.log('\n🔍 Type checks:');
  console.log('colorOptions is array of {name,hexValue} objects:', colorOk ? '✅ PASS' : '❌ FAIL');
  console.log('storageOptions is array of strings:', storageOk ? '✅ PASS' : '❌ FAIL');
  console.log('ram is array of strings:', ramOk ? '✅ PASS' : '❌ FAIL');

  // ── STEP 2: Simulate EDIT (fetch → prefill → update) ────────────────────────
  console.log('\n================================================');
  console.log('STEP 2: Simulate EDIT flow — modify and save');
  console.log('================================================');

  const fetched = await getProductById(created._id);
  console.log('\n📥 Product loaded into edit form:');
  console.log('colorOptions (prefilled):', JSON.stringify(fetched.colorOptions, null, 2));
  console.log('storageOptions (prefilled):', JSON.stringify(fetched.storageOptions, null, 2));
  console.log('ram (prefilled):', JSON.stringify(fetched.ram, null, 2));

  // Simulate admin adding "Titanium" and removing "Blue"
  const editPayload = {
    colorOptions: [
      { name: 'Black', hexValue: '#000000' },
      { name: 'Titanium', hexValue: '#878681' },
    ],
    storageOptions: ['256GB', '512GB', '1TB'],
    ram: ['8GB', '12GB', '16GB'],
  };

  console.log('\n📤 Payload sent to updateProduct():');
  console.log(JSON.stringify(editPayload, null, 2));

  const updated = await updateProduct(created._id.toString(), editPayload);

  console.log('\n✅ Product updated. Reading back from MongoDB:');
  console.log('colorOptions:', JSON.stringify(updated.colorOptions, null, 2));
  console.log('storageOptions:', JSON.stringify(updated.storageOptions, null, 2));
  console.log('ram:', JSON.stringify(updated.ram, null, 2));

  const editColorOk = Array.isArray(updated.colorOptions) && updated.colorOptions.length === 2 &&
    updated.colorOptions.some(c => c.name === 'Black') &&
    updated.colorOptions.some(c => c.name === 'Titanium') &&
    !updated.colorOptions.some(c => c.name === 'Blue');
  const editStorageOk = JSON.stringify(updated.storageOptions) === JSON.stringify(['256GB', '512GB', '1TB']);
  const editRamOk = JSON.stringify(updated.ram) === JSON.stringify(['8GB', '12GB', '16GB']);

  console.log('\n🔍 Edit verification:');
  console.log('colorOptions updated (Black+Titanium, no Blue):', editColorOk ? '✅ PASS' : '❌ FAIL');
  console.log('storageOptions updated to [256GB, 512GB, 1TB]:', editStorageOk ? '✅ PASS' : '❌ FAIL');
  console.log('ram updated to [8GB, 12GB, 16GB]:', editRamOk ? '✅ PASS' : '❌ FAIL');

  // ── STEP 3: Verify cart/order read path ────────────────────────────────────
  console.log('\n================================================');
  console.log('STEP 3: Verify cart/order read path');
  console.log('================================================');

  const cartProjection = await Product.findById(created._id)
    .select('stock storageOptions colorOptions')
    .lean();

  console.log('\n📥 Cart service projection (stock, storageOptions, colorOptions):');
  console.log(JSON.stringify(cartProjection, null, 2));

  const cartStorageCheck = cartProjection.storageOptions.includes('256GB');
  const cartColorCheck = cartProjection.colorOptions.some(c => c.name === 'Titanium');
  console.log('\n🔍 Cart validation simulation:');
  console.log('selectedStorage "256GB" in storageOptions:', cartStorageCheck ? '✅ PASS' : '❌ FAIL');
  console.log('selectedColor "Titanium" in colorOptions:', cartColorCheck ? '✅ PASS' : '❌ FAIL');

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await Product.findByIdAndDelete(created._id);
  console.log('\n🧹 Test product deleted from database.');
  console.log('\n================================================');
  console.log('ALL VERIFICATION CHECKS COMPLETE');
  console.log('================================================\n');

  process.exit(0);
};

run().catch((err) => {
  console.error('Verification failed:', err.message || err);
  process.exit(1);
});
