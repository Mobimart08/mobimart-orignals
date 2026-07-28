/* ==========================================================================
   src/services/cart.service.js
   Cart operations and guest cart merge business logic.
   ========================================================================== */

import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import { BadRequestError, NotFoundError } from '../utils/ApiError.js';

/**
 * Helper to retrieve or lazily create a cart for a user.
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

/**
 * Returns cart details populated with live product data.
 */
export const getCartByUserId = async (userId) => {
  const cart = await getOrCreateCart(userId);

  // Populate products to get live status, price, MRP, image, stock
  const populatedCart = await Cart.findById(cart._id).populate({
    path: 'items.productId',
    select: 'name slug brandName categoryName price originalPrice images stock isActive conditionType condition storageOptions colorOptions',
  }).lean();

  let subtotal = 0;
  let originalSubtotal = 0;
  let totalItems = 0;

  if (populatedCart && populatedCart.items) {
    populatedCart.items.forEach(item => {
      if (item.productId && item.productId.isActive) {
        subtotal += item.productId.price * item.quantity;
        originalSubtotal += (item.productId.originalPrice || item.productId.price) * item.quantity;
        totalItems += item.quantity;
      }
    });
  }

  return {
    ...populatedCart,
    subtotal,
    originalSubtotal,
    totalItems
  };
};

/**
 * Adds an item to the user's cart.
 * If exact variant (same ID, storage, color) already exists, increments quantity.
 */
export const addItemToCart = async (userId, { productId, selectedStorage, selectedColor, quantity = 1 }) => {
  // 1. Verify product exists, is active, and has stock
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw new NotFoundError('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available.`);
  }

  // Verify options are valid for this product
  if (!product.storageOptions.includes(selectedStorage)) {
    throw new BadRequestError(`Invalid storage variant '${selectedStorage}' chosen`);
  }

  const colorExists = product.colorOptions.some((c) => c.name === selectedColor);
  if (!colorExists) {
    throw new BadRequestError(`Invalid color variant '${selectedColor}' chosen`);
  }

  const cart = await getOrCreateCart(userId);

  // 2. Check if exact variant is already in the cart
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.toString() === productId.toString() &&
      item.selectedStorage === selectedStorage &&
      item.selectedColor === selectedColor
  );

  if (itemIndex > -1) {
    // Increment quantity
    const newQty = cart.items[itemIndex].quantity + quantity;
    if (newQty > 10) {
      throw new BadRequestError('Cannot add more than 10 of the same variant to your cart');
    }
    if (product.stock < newQty) {
      throw new BadRequestError(`Cannot add more. Only ${product.stock} items in stock.`);
    }
    cart.items[itemIndex].quantity = newQty;
  } else {
    // Add new line item. Check unique items count first (limit 20)
    if (cart.items.length >= 20) {
      throw new BadRequestError('Cart cannot exceed 20 unique items');
    }
    cart.items.push({
      productId,
      selectedStorage,
      selectedColor,
      quantity,
    });
  }

  await cart.save();
  return getCartByUserId(userId);
};

/**
 * Updates the quantity of a specific item in the cart using its item subdocument _id.
 */
export const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId.toString());
  if (itemIndex === -1) {
    throw new NotFoundError('Cart item not found');
  }

  if (quantity <= 0) {
    // Remove if quantity set to 0 or less
    cart.items.splice(itemIndex, 1);
  } else {
    if (quantity > 10) {
      throw new BadRequestError('Cannot set quantity higher than 10');
    }

    // Verify stock availability
    const item = cart.items[itemIndex];
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new BadRequestError('Product associated with this cart item is no longer available');
    }
    if (product.stock < quantity) {
      throw new BadRequestError(`Insufficient stock. Only ${product.stock} items available.`);
    }

    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return getCartByUserId(userId);
};

/**
 * Removes an item from the cart using its subdocument _id.
 */
export const removeItemFromCart = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId.toString());

  if (cart.items.length === initialLength) {
    throw new NotFoundError('Cart item not found');
  }

  await cart.save();
  return getCartByUserId(userId);
};

/**
 * Empties the cart.
 */
export const emptyCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
};

/**
 * Merges local guest cart array with user server-side cart.
 * Guest items format: [{ productId, selectedStorage, selectedColor, quantity }]
 */
export const mergeGuestCart = async (userId, guestItems = []) => {
  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    return { cart: await getCartByUserId(userId), skippedItems: [] };
  }

  const cart = await getOrCreateCart(userId);
  const skippedItems = [];

  for (const guestItem of guestItems) {
    const { productId, selectedStorage, selectedColor, quantity = 1 } = guestItem;

    // Verify product exists and is active before merging
    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product || product.stock <= 0) {
      skippedItems.push(guestItem);
      continue;
    }

    // Check if variant already in server cart
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.selectedStorage === selectedStorage &&
        item.selectedColor === selectedColor
    );

    if (itemIndex > -1) {
      // Merge quantity and cap at 10 or stock
      const mergedQty = Math.min(
        10,
        product.stock,
        cart.items[itemIndex].quantity + quantity
      );
      cart.items[itemIndex].quantity = mergedQty;
    } else {
      // Add new if limit not reached
      if (cart.items.length < 20) {
        const initialQty = Math.min(10, product.stock, quantity);
        cart.items.push({
          productId,
          selectedStorage,
          selectedColor,
          quantity: initialQty,
        });
      } else {
        skippedItems.push(guestItem);
      }
    }
  }

  await cart.save();
  return { cart: await getCartByUserId(userId), skippedItems };
};
