import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

const redisMock = {
  isReady: false,
  get: vi.fn(),
  setEx: vi.fn(),
  del: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
};

vi.mock('../../src/config/redis.js', () => ({
  default: redisMock,
}));

let app;
let User;
let Brand;
let Category;
let Product;
let initializeProductCatalogMetadata;
let signAccessToken;

const createAdminToken = async () => {
  const passwordHash = await bcrypt.hash('AdminPass123!', 12);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  return {
    admin,
    token: signAccessToken(admin._id, admin.role),
  };
};

beforeAll(async () => {
  ({ default: app } = await import('../../src/app.js'));
  ({ default: User } = await import('../../src/models/User.model.js'));
  ({ default: Brand } = await import('../../src/models/Brand.model.js'));
  ({ default: Category } = await import('../../src/models/Category.model.js'));
  ({ default: Product } = await import('../../src/models/Product.model.js'));
  ({ initializeProductCatalogMetadata } = await import('../../src/services/catalogBootstrap.service.js'));
  ({ signAccessToken } = await import('../../src/utils/generateToken.js'));
});

beforeEach(async () => {
  await initializeProductCatalogMetadata();
});

describe('Product management upgrade', () => {
  it('pre-populates default smartphone brands and product categories', async () => {
    const brandNames = await Brand.find({}).sort({ sortOrder: 1 }).distinct('name');
    const categoryNames = await Category.find({}).sort({ sortOrder: 1 }).distinct('name');

    expect(brandNames).toContain('Apple');
    expect(brandNames).toContain('Google Pixel');
    expect(brandNames).toContain('CMF by Nothing');
    expect(categoryNames).toContain('Smartphones');
    expect(categoryNames).toContain('Accessories');
    expect(categoryNames).toContain('Wireless Earbuds');
  });

  it('creates a product with sku and productCondition, then exposes it through admin and storefront filters', async () => {
    const { token } = await createAdminToken();
    const apple = await Brand.findOne({ slug: 'apple' });
    const smartphones = await Category.findOne({ slug: 'smartphones' });

    const createResponse = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        sku: 'APL-IP15PM-001',
        brand: String(apple._id),
        category: String(smartphones._id),
        productCondition: 'Open Box',
        price: 124999,
        originalPrice: 139999,
        stock: 5,
        lowStockThreshold: 2,
        storageOptions: ['256GB'],
        colorOptions: [{ name: 'Natural Titanium', hexValue: '#d6cec1' }],
        images: [{ url: 'https://example.com/iphone.jpg', publicId: 'iphone-1', isPrimary: true }],
        description: 'Premium iPhone listing prepared for admin product management verification with condition and SEO support.',
        specifications: [
          { name: 'RAM', value: '8GB' },
          { name: 'Storage', value: '256GB' },
        ],
        warranty: '1 Year Warranty',
        metaTitle: 'iPhone 15 Pro Max Open Box',
        metaDescription: 'Open box iPhone 15 Pro Max available for sale.',
        isActive: true,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.productCondition).toBe('Open Box');
    expect(createResponse.body.data.conditionType).toBe('New');

    const storefrontResponse = await request(app)
      .get('/api/v1/products')
      .query({ brand: 'Apple', category: 'Smartphones', productCondition: 'Open Box', page: 1, limit: 20 });

    expect(storefrontResponse.status).toBe(200);
    const storefrontItems = storefrontResponse.body.data;
    expect(storefrontItems.some((product) => product.sku === 'APL-IP15PM-001')).toBe(true);

    const adminListResponse = await request(app)
      .get('/api/v1/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .query({ q: 'APL-IP15PM-001', status: 'published' });

    expect(adminListResponse.status).toBe(200);
    expect(adminListResponse.body.data.data).toHaveLength(1);
    expect(adminListResponse.body.data.data[0].productCondition).toBe('Open Box');
  });

  it('keeps existing products compatible by backfilling missing productCondition and sku fields', async () => {
    const brand = await Brand.findOne({ slug: 'samsung' });
    const category = await Category.findOne({ slug: 'smartphones' });

    const legacyProduct = await Product.create({
      name: 'Legacy Galaxy S23',
      slug: 'legacy-galaxy-s23',
      brand: brand._id,
      brandName: brand.name,
      category: category._id,
      categoryName: category.name,
      conditionType: 'Used',
      condition: 'Excellent',
      price: 49999,
      originalPrice: 69999,
      stock: 3,
      storageOptions: ['128GB'],
      colorOptions: [{ name: 'Black', hexValue: '#000000' }],
      images: [{ url: 'https://example.com/legacy-galaxy.jpg', publicId: 'legacy-1', isPrimary: true }],
      description: 'Legacy product document created without the new condition and sku fields for migration validation coverage.',
      specifications: [{ name: 'RAM', value: '8GB' }],
      warranty: '6 Months Warranty',
    });

    await Product.updateOne({ _id: legacyProduct._id }, { $unset: { productCondition: 1, sku: 1, metaTitle: 1, metaDescription: 1 } });
    await initializeProductCatalogMetadata();

    const migrated = await Product.findById(legacyProduct._id).lean();
    expect(migrated.productCondition).toBe('Used');
    expect(migrated.sku).toBeTruthy();
    expect(migrated.metaTitle).toBeTruthy();
    expect(migrated.metaDescription).toBeTruthy();
  });
});

