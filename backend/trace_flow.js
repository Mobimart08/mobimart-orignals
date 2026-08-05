import connectDB from './src/config/db.js';
import mongoose from 'mongoose';
import Cart from './src/models/Cart.model.js';
import Order from './src/models/Order.model.js';
import Product from './src/models/Product.model.js';
import User from './src/models/User.model.js';
import Category from './src/models/Category.model.js';
import Brand from './src/models/Brand.model.js';
import Address from './src/models/Address.model.js';
import { addItemToCart } from './src/services/cart.service.js';
import { createOrder } from './src/services/order.service.js';

const run = async () => {
  await connectDB();

  try {
    // Setup fake user and product
    const testUser = await User.findOne({}).lean();
    let testProduct = await Product.findOne({ ram: { $exists: true, $not: { $size: 0 } }, isActive: true }).lean();

    if (!testProduct) {
        console.log('Creating dummy product with RAM...');
        const cat = await Category.findOne({}).lean();
        const brand = await Brand.findOne({}).lean();

        testProduct = await Product.create({
            name: 'Trace Test Product',
            slug: 'trace-test-product',
            brand: brand._id,
            category: cat._id,
            price: 500,
            stock: 100,
            storageOptions: ['128GB'],
            colorOptions: [{ name: 'Black', hexValue: '#000000' }],
            ram: ['16GB'],
            isActive: true,
            productCondition: 'New',
        });
    }

    console.log('\n--- 1. Testing addItemToCart (Cart.model.js) ---');
    const selectedStorage = testProduct.storageOptions?.[0] || '128GB';
    const selectedColor = testProduct.colorOptions?.[0]?.name || 'Black';
    const selectedRam = testProduct.ram?.[0] || '16GB';

    // Make sure cart is clear
    await Cart.findOneAndDelete({ userId: testUser._id });

    // Add to cart using the service (which simulates the API flow)
    await addItemToCart(testUser._id, {
        productId: testProduct._id,
        selectedStorage,
        selectedColor,
        selectedRam,
        quantity: 1
    });

    const cartDoc = await Cart.findOne({ userId: testUser._id }).lean();
    console.log('Cart Items JSON (MongoDB):');
    console.log(JSON.stringify(cartDoc.items, null, 2));

    console.log('\n--- 2. Testing createOrder (Order.model.js) ---');
    let address = await Address.findOne({ userId: testUser._id }).lean();
    if (!address) {
      address = await Address.create({
        userId: testUser._id,
        name: testUser.name,
        phone: '9999999999',
        email: testUser.email,
        addressLine1: 'Test St',
        city: 'Test City',
        state: 'Test State',
        pinCode: '111111'
      });
    }

    const orderData = await createOrder({
        userId: testUser._id,
        addressId: address._id,
        paymentMethod: 'COD'
    });
    
    const orderDoc = await Order.findOne({ _id: orderData._id }).lean();
    console.log('Order Items JSON (MongoDB):');
    console.log(JSON.stringify(orderDoc.items, null, 2));

    // Cleanup
    await Cart.findOneAndDelete({ userId: testUser._id });
    await Order.findByIdAndDelete(orderData._id);
    if (testProduct.name === 'Trace Test Product') {
        await Product.findByIdAndDelete(testProduct._id);
    }
    
    console.log('\n--- Flow Verification Complete ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
