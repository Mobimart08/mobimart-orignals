/* ==========================================================================
   src/services/cart.service.js
   Cart operations and guest cart merge business logic.
   Optimized for <100ms response time.
   ========================================================================== */

import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import { BadRequestError, NotFoundError } from '../utils/ApiError.js';

const POPULATE_FIELDS = 'name price images stock slug deliveryCharge';

const formatCartResponse = (cartObj) => {
  let subtotal = 0;
  let originalSubtotal = 0;
  let totalItems = 0;
  let totalDeliveryCharge = 0;

  if (cartObj && cartObj.items) {
    cartObj.items.forEach(item => {
      if (item.productId) {
        subtotal += (item.productId.price || 0) * item.quantity;
        originalSubtotal += (item.productId.originalPrice || item.productId.price || 0) * item.quantity;
        totalDeliveryCharge += (item.productId.deliveryCharge || 0) * item.quantity;
        totalItems += item.quantity;
      }
    });
  }

  return { ...cartObj, subtotal, originalSubtotal, totalDeliveryCharge, totalItems };
};

/**
 * Returns cart details populated with live product data (optimized with lean).
 */
export const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: POPULATE_FIELDS,
  }).lean();

  if (!cart) {
    const newCart = await Cart.create({ userId, items: [] });
    cart = newCart.toObject();
  }

  return formatCartResponse(cart);
};

/**
 * Helper to retrieve or lazily create a cart for a user (returns Mongoose doc for mutations).
 */
const getOrCreateCartDoc = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

/**
 * Adds an item to the user's cart.
 */
export const addItemToCart = async (userId, { productId, selectedStorage, selectedColor, selectedRam, quantity = 1 }) => {
  // 1. Verify product exists, is active, and has stock using lean()
  const product = await Product.findOne({ _id: productId, isActive: true })
    .select('stock storageOptions colorOptions ram')
    .lean();
    
  if (!product) {
    throw new NotFoundError('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available.`);
  }

  // Verify options are valid for this product
  if (product.storageOptions && product.storageOptions.length > 0) {
    if (!product.storageOptions.includes(selectedStorage)) {
      throw new BadRequestError(`Invalid storage variant '${selectedStorage}' chosen`);
    }
  }

  if (product.colorOptions && product.colorOptions.length > 0) {
    const colorExists = product.colorOptions.some((c) => c.name === selectedColor);
    if (!colorExists) {
      throw new BadRequestError(`Invalid color variant '${selectedColor}' chosen`);
    }
  }

  if (product.ram && product.ram.length > 0) {
    if (!product.ram.includes(selectedRam)) {
      throw new BadRequestError(`Invalid RAM variant '${selectedRam}' chosen`);
    }
  }

  const cart = await getOrCreateCartDoc(userId);

  // 2. Check if exact variant is already in the cart
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.toString() === productId.toString() &&
      item.selectedStorage === selectedStorage &&
      item.selectedColor === selectedColor &&
      (item.selectedRam || null) === (selectedRam || null)
  );

  if (itemIndex > -1) {
    const newQty = cart.items[itemIndex].quantity + quantity;
    if (newQty > 10) {
      throw new BadRequestError('Cannot add more than 10 of the same variant to your cart');
    }
    if (product.stock < newQty) {
      throw new BadRequestError(`Cannot add more. Only ${product.stock} items in stock.`);
    }
    cart.items[itemIndex].quantity = newQty;
  } else {
    if (cart.items.length >= 20) {
      throw new BadRequestError('Cart cannot exceed 20 unique items');
    }
    cart.items.push({ productId, selectedStorage, selectedColor, selectedRam: selectedRam || null, quantity });
  }

  await cart.save();
  await cart.populate({ path: 'items.productId', select: POPULATE_FIELDS });
  
  return formatCartResponse(cart.toObject());
};

/**
 * Updates the quantity of a specific item in the cart.
 */
export const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCartDoc(userId);

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId.toString());
  if (itemIndex === -1) {
    throw new NotFoundError('Cart item not found');
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    if (quantity > 10) {
      throw new BadRequestError('Cannot set quantity higher than 10');
    }

    const item = cart.items[itemIndex];
    const product = await Product.findById(item.productId).select('isActive stock').lean();
    if (!product || !product.isActive) {
      throw new BadRequestError('Product associated with this cart item is no longer available');
    }
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available.`);
    }

    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate({ path: 'items.productId', select: POPULATE_FIELDS });
  
  return formatCartResponse(cart.toObject());
};

/**
 * Removes an item from the cart.
 */
export const removeItemFromCart = async (userId, itemId) => {
  const cart = await getOrCreateCartDoc(userId);

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId.toString());

  if (cart.items.length === initialLength) {
    throw new NotFoundError('Cart item not found');
  }

  await cart.save();
  await cart.populate({ path: 'items.productId', select: POPULATE_FIELDS });
  
  return formatCartResponse(cart.toObject());
};

/**
 * Empties the cart.
 */
export const emptyCart = async (userId) => {
  const cart = await getOrCreateCartDoc(userId);
  cart.items = [];
  await cart.save();
};

/**
 * Merges local guest cart array with user server-side cart.
 */
export const mergeGuestCart = async (userId, guestItems = []) => {
  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    return { cart: await getCartByUserId(userId), skippedItems: [] };
  }

  const cart = await getOrCreateCartDoc(userId);
  const skippedItems = [];

  const productIds = guestItems.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true }).select('stock').lean();
  const productMap = products.reduce((acc, product) => {
    acc[product._id.toString()] = product;
    return acc;
  }, {});

  for (const guestItem of guestItems) {
    const { productId, selectedStorage, selectedColor, selectedRam, quantity = 1 } = guestItem;

    const product = productMap[productId.toString()];
    if (!product || product.stock <= 0) {
      skippedItems.push(guestItem);
      continue;
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.selectedStorage === selectedStorage &&
        item.selectedColor === selectedColor &&
        (item.selectedRam || null) === (selectedRam || null)
    );

    if (itemIndex > -1) {
      const mergedQty = Math.min(10, product.stock, cart.items[itemIndex].quantity + quantity);
      cart.items[itemIndex].quantity = mergedQty;
    } else {
      if (cart.items.length < 20) {
        const initialQty = Math.min(10, product.stock, quantity);
        cart.items.push({ productId, selectedStorage, selectedColor, selectedRam: selectedRam || null, quantity: initialQty });
      } else {
        skippedItems.push(guestItem);
      }
    }
  }

  await cart.save();
  await cart.populate({ path: 'items.productId', select: POPULATE_FIELDS });
  
  return { cart: formatCartResponse(cart.toObject()), skippedItems };
};
