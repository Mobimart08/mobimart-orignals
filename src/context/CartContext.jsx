import React, { createContext, useContext, useState, useEffect } from 'react';

/* ==========================================================================
   Cart Context
   - Manages state, options, and quantities of items in the user's cart
   - Persists state in Local Storage under 'mobimart_cart'
   ========================================================================== */

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('mobimart_cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Sync with Local Storage whenever cart items change
  useEffect(() => {
    localStorage.setItem('mobimart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (product, selectedStorage, selectedColor, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if exact variant (same ID, storage, and color) already exists in cart
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedStorage === selectedStorage &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, selectedStorage, selectedColor, quantity }];
      }
    });
  };

  // Remove specific variant from the cart
  const removeFromCart = (productId, selectedStorage, selectedColor) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedStorage === selectedStorage &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  // Update item quantity
  const updateQuantity = (productId, selectedStorage, selectedColor, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedStorage, selectedColor);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        item.selectedStorage === selectedStorage &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items quantity count
  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: getCartCount(),
      }}
    >
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
