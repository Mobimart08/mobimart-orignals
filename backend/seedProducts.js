import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Brand from './src/models/Brand.model.js';
import Category from './src/models/Category.model.js';
import Product from './src/models/Product.model.js';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const slugify = (text) => text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text

const phones = [
  { name: 'iPhone 15 Pro Max', brand: 'Apple', price: 159900, originalPrice: 159900, stock: 45, display: '6.7" Super Retina XDR OLED', processor: 'A17 Pro', ram: '8GB', storage: '256GB, 512GB, 1TB', battery: '4422 mAh', camera: '48MP + 12MP + 12MP Rear, 12MP Front', os: 'iOS 17' },
  { name: 'iPhone 15 Pro', brand: 'Apple', price: 134900, originalPrice: 134900, stock: 30, display: '6.1" Super Retina XDR OLED', processor: 'A17 Pro', ram: '8GB', storage: '128GB, 256GB, 512GB, 1TB', battery: '3274 mAh', camera: '48MP + 12MP + 12MP Rear, 12MP Front', os: 'iOS 17' },
  { name: 'iPhone 15', brand: 'Apple', price: 79900, originalPrice: 79900, stock: 120, display: '6.1" Super Retina XDR OLED', processor: 'A16 Bionic', ram: '6GB', storage: '128GB, 256GB, 512GB', battery: '3349 mAh', camera: '48MP + 12MP Rear, 12MP Front', os: 'iOS 17' },
  { name: 'iPhone 14', brand: 'Apple', price: 69900, originalPrice: 79900, stock: 65, display: '6.1" Super Retina XDR OLED', processor: 'A15 Bionic', ram: '6GB', storage: '128GB, 256GB, 512GB', battery: '3279 mAh', camera: '12MP + 12MP Rear, 12MP Front', os: 'iOS 16' },
  { name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 129999, originalPrice: 134999, stock: 25, display: '6.8" Dynamic AMOLED 2X', processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB, 512GB, 1TB', battery: '5000 mAh', camera: '200MP + 50MP + 12MP + 10MP Rear, 12MP Front', os: 'Android 14' },
  { name: 'Galaxy S24+', brand: 'Samsung', price: 99999, originalPrice: 99999, stock: 40, display: '6.7" Dynamic AMOLED 2X', processor: 'Exynos 2400', ram: '12GB', storage: '256GB, 512GB', battery: '4900 mAh', camera: '50MP + 12MP + 10MP Rear, 12MP Front', os: 'Android 14' },
  { name: 'Galaxy S24', brand: 'Samsung', price: 79999, originalPrice: 79999, stock: 80, display: '6.2" Dynamic AMOLED 2X', processor: 'Exynos 2400', ram: '8GB', storage: '128GB, 256GB', battery: '4000 mAh', camera: '50MP + 12MP + 10MP Rear, 12MP Front', os: 'Android 14' },
  { name: 'Galaxy Z Fold 5', brand: 'Samsung', price: 154999, originalPrice: 164999, stock: 15, display: '7.6" Foldable Dynamic AMOLED 2X', processor: 'Snapdragon 8 Gen 2', ram: '12GB', storage: '256GB, 512GB, 1TB', battery: '4400 mAh', camera: '50MP + 12MP + 10MP Rear, 4MP Under Display', os: 'Android 13' },
  { name: 'Galaxy Z Flip 5', brand: 'Samsung', price: 99999, originalPrice: 99999, stock: 35, display: '6.7" Foldable Dynamic AMOLED 2X', processor: 'Snapdragon 8 Gen 2', ram: '8GB', storage: '256GB, 512GB', battery: '3700 mAh', camera: '12MP + 12MP Rear, 10MP Front', os: 'Android 13' },
  { name: 'Pixel 8 Pro', brand: 'Google', price: 106999, originalPrice: 106999, stock: 20, display: '6.7" LTPO OLED', processor: 'Google Tensor G3', ram: '12GB', storage: '128GB, 256GB, 512GB', battery: '5050 mAh', camera: '50MP + 48MP + 48MP Rear, 10.5MP Front', os: 'Android 14' },
  { name: 'Pixel 8', brand: 'Google', price: 75999, originalPrice: 75999, stock: 55, display: '6.2" OLED', processor: 'Google Tensor G3', ram: '8GB', storage: '128GB, 256GB', battery: '4575 mAh', camera: '50MP + 12MP Rear, 10.5MP Front', os: 'Android 14' },
  { name: 'Pixel 7a', brand: 'Google', price: 43999, originalPrice: 43999, stock: 90, display: '6.1" OLED', processor: 'Google Tensor G2', ram: '8GB', storage: '128GB', battery: '4385 mAh', camera: '64MP + 13MP Rear, 13MP Front', os: 'Android 13' },
  { name: 'OnePlus 12', brand: 'OnePlus', price: 64999, originalPrice: 69999, stock: 60, display: '6.82" LTPO AMOLED', processor: 'Snapdragon 8 Gen 3', ram: '12GB, 16GB', storage: '256GB, 512GB', battery: '5400 mAh', camera: '50MP + 64MP + 48MP Rear, 32MP Front', os: 'Android 14' },
  { name: 'OnePlus 12R', brand: 'OnePlus', price: 39999, originalPrice: 39999, stock: 110, display: '6.78" LTPO4 AMOLED', processor: 'Snapdragon 8 Gen 2', ram: '8GB, 16GB', storage: '128GB, 256GB', battery: '5500 mAh', camera: '50MP + 8MP + 2MP Rear, 16MP Front', os: 'Android 14' },
  { name: 'OnePlus Nord 3', brand: 'OnePlus', price: 33999, originalPrice: 33999, stock: 85, display: '6.74" Fluid AMOLED', processor: 'Dimensity 9000', ram: '8GB, 16GB', storage: '128GB, 256GB', battery: '5000 mAh', camera: '50MP + 8MP + 2MP Rear, 16MP Front', os: 'Android 13' },
  { name: 'Xiaomi 14', brand: 'Xiaomi', price: 69999, originalPrice: 69999, stock: 40, display: '6.36" LTPO OLED', processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB, 512GB', battery: '4610 mAh', camera: '50MP + 50MP + 50MP Rear, 32MP Front', os: 'Android 14' },
  { name: 'Redmi Note 13 Pro+', brand: 'Xiaomi', price: 31999, originalPrice: 31999, stock: 150, display: '6.67" AMOLED', processor: 'Dimensity 7200 Ultra', ram: '8GB, 12GB', storage: '256GB, 512GB', battery: '5000 mAh', camera: '200MP + 8MP + 2MP Rear, 16MP Front', os: 'Android 13' },
  { name: 'Vivo X100 Pro', brand: 'Vivo', price: 89999, originalPrice: 89999, stock: 20, display: '6.78" LTPO AMOLED', processor: 'Dimensity 9300', ram: '16GB', storage: '512GB', battery: '5400 mAh', camera: '50MP + 50MP + 50MP Rear, 32MP Front', os: 'Android 14' },
  { name: 'Vivo V30 Pro', brand: 'Vivo', price: 41999, originalPrice: 41999, stock: 65, display: '6.78" AMOLED', processor: 'Dimensity 8200', ram: '8GB, 12GB', storage: '256GB, 512GB', battery: '5000 mAh', camera: '50MP + 50MP + 50MP Rear, 50MP Front', os: 'Android 14' },
  { name: 'Nothing Phone (2)', brand: 'Nothing', price: 39999, originalPrice: 44999, stock: 45, display: '6.7" LTPO OLED', processor: 'Snapdragon 8+ Gen 1', ram: '8GB, 12GB', storage: '128GB, 256GB, 512GB', battery: '4700 mAh', camera: '50MP + 50MP Rear, 32MP Front', os: 'Android 13' },
];

const getImageForBrand = (brand) => {
  const images = {
    'Apple': 'https://images.unsplash.com/photo-1603791236528-7265be87ce4e?auto=format&fit=crop&q=80&w=1080',
    'Samsung': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1080',
    'Google': 'https://images.unsplash.com/photo-1636181829630-1b203c963665?auto=format&fit=crop&q=80&w=1080',
    'OnePlus': 'https://images.unsplash.com/photo-1678949826359-866411be07ad?auto=format&fit=crop&q=80&w=1080',
    'Xiaomi': 'https://images.unsplash.com/photo-1647781523315-7076df3dceeb?auto=format&fit=crop&q=80&w=1080',
    'Vivo': 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?auto=format&fit=crop&q=80&w=1080',
    'Nothing': 'https://images.unsplash.com/photo-1679051833119-94ffc89a0c64?auto=format&fit=crop&q=80&w=1080',
  };
  return images[brand] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1080';
};

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('No MONGODB_URI found in .env');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Ensure category
    let category = await Category.findOne({ name: 'Smartphones' });
    if (!category) {
      category = await Category.create({ name: 'Smartphones', slug: 'smartphones', description: 'Premium smartphones' });
      console.log('Created Category: Smartphones');
    }

    const brandNames = [...new Set(phones.map(p => p.brand))];
    const brandMap = {};

    for (const bName of brandNames) {
      let brand = await Brand.findOne({ name: bName });
      if (!brand) {
        brand = await Brand.create({ name: bName, slug: slugify(bName) });
        console.log(`Created Brand: ${bName}`);
      }
      brandMap[bName] = brand._id;
    }

    console.log('Seeding products...');
    let count = 0;
    for (const phone of phones) {
      const slug = slugify(phone.name);
      const existing = await Product.findOne({ slug });
      if (existing) {
        console.log(`Skipping ${phone.name} - already exists`);
        continue;
      }

      await Product.create({
        name: phone.name,
        slug: slug,
        sku: `SKU-${slug.toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        brand: brandMap[phone.brand],
        brandName: phone.brand,
        category: category._id,
        categoryName: category.name,
        productCondition: 'New',
        conditionType: 'New',
        condition: 'New',
        price: phone.price,
        originalPrice: phone.originalPrice,
        stock: phone.stock,
        lowStockThreshold: 5,
        isActive: true,
        status: 'Published',
        description: `The \${phone.name} is a premium device offering incredible performance, beautiful design, and an advanced camera system. Experience the cutting edge of mobile technology.`,
        warranty: '1 Year Manufacturer Warranty',
        specifications: [
          { name: 'Display', value: phone.display },
          { name: 'Processor', value: phone.processor },
          { name: 'RAM', value: phone.ram },
          { name: 'Storage', value: phone.storage },
          { name: 'Battery', value: phone.battery },
          { name: 'Camera', value: phone.camera },
          { name: 'Operating System', value: phone.os }
        ],
        storageOptions: phone.storage.split(', '),
        colorOptions: [
          { name: 'Midnight Black', hexValue: '#000000' },
          { name: 'Silver', hexValue: '#C0C0C0' }
        ],
        images: [
          { url: getImageForBrand(phone.brand), publicId: `seed_${slug}`, isPrimary: true, alt: phone.name }
        ],
        metaTitle: `${phone.name} - Buy Online`,
        metaDescription: `Buy the new ${phone.name} with ${phone.storage} storage and ${phone.ram} RAM. Get the best price today.`,
      });
      console.log(`Inserted ${phone.name}`);
      count++;
    }

    console.log(`\nSuccess! Seeded ${count} mobile phones.`);
    process.exit(0);

  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

run();
