import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { cartService } from '../api/services';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(undefined);
const GUEST_CART_KEY = 'mobimart_guest_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, originalSubtotal: 0, totalItems: 0 });
  const { user } = useAuth();
  const { showToast } = useToast();

  const calculateGuestTotals = useCallback((items) => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let totalItems = 0;

    items.forEach(item => {
      totalItems += item.quantity;
      const price = item.product?.price || 0;
      const mrp = item.product?.mrp || price;
      subtotal += price * item.quantity;
      originalSubtotal += mrp * item.quantity;
    });

    setCartItems(items);
    setCartTotals({ subtotal, originalSubtotal, totalItems });
  }, []);

  const getGuestCart = useCallback(() => JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]'), []);
  
  const saveGuestCart = useCallback((items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    calculateGuestTotals(items);
  }, [calculateGuestTotals]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      calculateGuestTotals(getGuestCart());
      return;
    }
    try {
      const res = await cartService.getCart();
      const data = res.data.data;
      setCartItems(data.items || []);
      setCartTotals({
        subtotal: data.subtotal || 0,
        originalSubtotal: data.originalSubtotal || 0,
        totalItems: data.totalItems || 0,
      });
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  }, [user, calculateGuestTotals, getGuestCart]);

  const handleGuestCartMerge = useCallback(async () => {
    if (user) {
      const guestItems = getGuestCart();
      if (guestItems.length > 0) {
        try {
          const payload = guestItems.map(i => ({
            productId: i.productId,
            selectedStorage: i.selectedStorage || 'Default',
            selectedColor: i.selectedColor || 'Default',
            quantity: i.quantity
          }));
          const res = await cartService.mergeCart(payload);
          const skippedItems = res.data.data.skippedItems;
          if (skippedItems && skippedItems.length > 0) {
            showToast(`${skippedItems.length} item(s) from your guest cart were removed because they are out of stock.`, 'warning');
          }
          localStorage.removeItem(GUEST_CART_KEY);
        } catch (err) {
          console.error('Failed to merge guest cart', err);
        }
      }
      await fetchCart();
    }
  }, [user, getGuestCart, showToast, fetchCart]);

  useEffect(() => {
    if (user) {
      handleGuestCartMerge();
    } else {
      fetchCart();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = useCallback(async (product, selectedStorage, selectedColor, quantity = 1) => {
    const productId = product._id || product.id;
    
    if (!user) {
      const items = getGuestCart();
      const idx = items.findIndex(i => 
        i.productId === productId && 
        i.selectedStorage === selectedStorage && 
        i.selectedColor === selectedColor
      );
      if (idx > -1) {
        items[idx].quantity += quantity;
      } else {
        items.push({ productId, product, selectedStorage, selectedColor, quantity });
      }
      saveGuestCart(items);
      return;
    }
    
    try {
      await cartService.addItem({ 
        productId, 
        quantity, 
        selectedStorage: selectedStorage || 'Default', 
        selectedColor: selectedColor || 'Default' 
      });
      await fetchCart();
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  }, [user, getGuestCart, saveGuestCart, fetchCart]);

  const removeFromCart = useCallback(async (productId, selectedStorage, selectedColor, cartItemId = null) => {
    if (!user) {
      const items = getGuestCart().filter(i => 
        (cartItemId && i._id !== cartItemId) &&
        !(i.productId === productId && i.selectedStorage === selectedStorage && i.selectedColor === selectedColor)
      );
      saveGuestCart(items);
      return;
    }
    try {
      const item = cartItems.find(i => {
        if (cartItemId && i._id === cartItemId) return true;
        const p = i.product || i.productId;
        return p && (p._id === productId || p.id === productId);
      });
      if (item && item._id) {
        await cartService.removeItem(item._id);
        await fetchCart();
      }
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  }, [user, cartItems, getGuestCart, saveGuestCart, fetchCart]);

  const updateQuantity = useCallback(async (productId, selectedStorage, selectedColor, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId, selectedStorage, selectedColor);
    }
    
    if (!user) {
      const items = getGuestCart();
      const idx = items.findIndex(i => 
        i.productId === productId && i.selectedStorage === selectedStorage && i.selectedColor === selectedColor
      );
      if (idx > -1) {
        items[idx].quantity = quantity;
        saveGuestCart(items);
      }
      return;
    }

    try {
      const item = cartItems.find(i => {
        const p = i.product || i.productId;
        return p && (p._id === productId || p.id === productId);
      });
      if (item && item._id) {
        await cartService.updateItem(item._id, quantity);
        await fetchCart();
      }
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  }, [user, cartItems, getGuestCart, saveGuestCart, removeFromCart, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user) {
      saveGuestCart([]);
      return;
    }
    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  }, [user, saveGuestCart, fetchCart]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cartItems,
    cartTotals,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount: cartTotals.totalItems || 0,
  }), [cartItems, cartTotals, addToCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
