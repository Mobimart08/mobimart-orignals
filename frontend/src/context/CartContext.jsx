import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  // Use refs to keep stable callbacks for React.memo
  const stateRef = useRef({ items: [], totals: { subtotal: 0, originalSubtotal: 0, totalItems: 0 } });
  useEffect(() => {
    stateRef.current = { items: cartItems, totals: cartTotals };
  }, [cartItems, cartTotals]);

  const calculateTotals = useCallback((items) => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let totalItems = 0;

    items.forEach(item => {
      totalItems += item.quantity;
      const p = item.product || item.productId;
      const price = p?.price || 0;
      const mrp = p?.originalPrice || p?.mrp || price;
      subtotal += price * item.quantity;
      originalSubtotal += mrp * item.quantity;
    });

    setCartItems(items);
    setCartTotals({ subtotal, originalSubtotal, totalItems });
  }, []);

  const applyServerCart = useCallback((data) => {
    setCartItems(data.items || []);
    setCartTotals({
      subtotal: data.subtotal || 0,
      originalSubtotal: data.originalSubtotal || 0,
      totalItems: data.totalItems || 0,
    });
  }, []);

  const getGuestCart = useCallback(() => JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]'), []);
  
  const saveGuestCart = useCallback((items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    calculateTotals(items);
  }, [calculateTotals]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      calculateTotals(getGuestCart());
      return;
    }
    try {
      const res = await cartService.getCart();
      applyServerCart(res.data.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  }, [user, calculateTotals, getGuestCart, applyServerCart]);

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
    const storage = selectedStorage || 'Default';
    const color = selectedColor || 'Default';
    
    if (!user) {
      const items = getGuestCart();
      const idx = items.findIndex(i => 
        i.productId === productId && 
        i.selectedStorage === storage && 
        i.selectedColor === color
      );
      if (idx > -1) {
        items[idx].quantity += quantity;
      } else {
        items.push({ productId, product, selectedStorage: storage, selectedColor: color, quantity });
      }
      saveGuestCart(items);
      return;
    }
    
    const { items: prevItems, totals: prevTotals } = stateRef.current;
    
    // Optimistic UI
    const optimisticItems = [...prevItems];
    const idx = optimisticItems.findIndex(i => {
      const p = i.product || i.productId;
      return p && (p._id === productId || p.id === productId) && i.selectedStorage === storage && i.selectedColor === color;
    });
    
    if (idx > -1) {
      optimisticItems[idx] = { ...optimisticItems[idx], quantity: optimisticItems[idx].quantity + quantity };
    } else {
      optimisticItems.push({ productId: product, selectedStorage: storage, selectedColor: color, quantity });
    }
    calculateTotals(optimisticItems);
    
    try {
      const res = await cartService.addItem({ productId, quantity, selectedStorage: storage, selectedColor: color });
      applyServerCart(res.data.data);
    } catch (err) {
      // Revert
      setCartItems(prevItems);
      setCartTotals(prevTotals);
      showToast(err?.response?.data?.message || 'Failed to add item', 'error');
      console.error('Failed to add to cart', err);
    }
  }, [user, getGuestCart, saveGuestCart, calculateTotals, applyServerCart, showToast]);

  const removeFromCart = useCallback(async (productId, selectedStorage, selectedColor, cartItemId = null) => {
    if (!user) {
      const items = getGuestCart().filter(i => 
        (cartItemId && i._id !== cartItemId) &&
        !(i.productId === productId && i.selectedStorage === selectedStorage && i.selectedColor === selectedColor)
      );
      saveGuestCart(items);
      return;
    }

    const { items: prevItems, totals: prevTotals } = stateRef.current;
    const itemToRemove = prevItems.find(i => {
      if (cartItemId && i._id === cartItemId) return true;
      const p = i.product || i.productId;
      return p && (p._id === productId || p.id === productId) && i.selectedStorage === selectedStorage && i.selectedColor === selectedColor;
    });

    if (!itemToRemove) return;

    // Optimistic UI
    const optimisticItems = prevItems.filter(i => i._id !== itemToRemove._id);
    calculateTotals(optimisticItems);

    try {
      const res = await cartService.removeItem(itemToRemove._id);
      applyServerCart(res.data.data);
    } catch (err) {
      setCartItems(prevItems);
      setCartTotals(prevTotals);
      showToast(err?.response?.data?.message || 'Failed to remove item', 'error');
      console.error('Failed to remove from cart', err);
    }
  }, [user, getGuestCart, saveGuestCart, calculateTotals, applyServerCart, showToast]);

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

    const { items: prevItems, totals: prevTotals } = stateRef.current;
    const itemToUpdate = prevItems.find(i => {
      const p = i.product || i.productId;
      return p && (p._id === productId || p.id === productId) && i.selectedStorage === selectedStorage && i.selectedColor === selectedColor;
    });

    if (!itemToUpdate) return;

    // Optimistic UI
    const optimisticItems = prevItems.map(i => 
      i._id === itemToUpdate._id ? { ...i, quantity } : i
    );
    calculateTotals(optimisticItems);

    try {
      const res = await cartService.updateItem(itemToUpdate._id, quantity);
      applyServerCart(res.data.data);
    } catch (err) {
      setCartItems(prevItems);
      setCartTotals(prevTotals);
      showToast(err?.response?.data?.message || 'Failed to update quantity', 'error');
      console.error('Failed to update quantity', err);
    }
  }, [user, getGuestCart, saveGuestCart, removeFromCart, calculateTotals, applyServerCart, showToast]);

  const clearCart = useCallback(async () => {
    if (!user) {
      saveGuestCart([]);
      return;
    }

    const { items: prevItems, totals: prevTotals } = stateRef.current;
    
    // Optimistic UI
    calculateTotals([]);

    try {
      const res = await cartService.clearCart();
      if (res.data.data) {
          applyServerCart(res.data.data);
      } else {
          // Fallback if clear doesn't return populated empty cart
          calculateTotals([]);
      }
    } catch (err) {
      setCartItems(prevItems);
      setCartTotals(prevTotals);
      showToast(err?.response?.data?.message || 'Failed to clear cart', 'error');
      console.error('Failed to clear cart', err);
    }
  }, [user, saveGuestCart, calculateTotals, applyServerCart, showToast]);

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
