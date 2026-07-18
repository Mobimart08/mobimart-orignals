import React, { createContext, useContext, useState, useEffect } from 'react';

/* ==========================================================================
   Wishlist Context
   - Manages state of products marked as favorite/liked by the user
   - Persists wishlist items in Local Storage under 'mobimart_wishlist'
   ========================================================================== */

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem('mobimart_wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  // Sync with Local Storage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('mobimart_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Toggle wishlist state (add if absent, remove if present)
  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      if (exists) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  // Helper to check if a specific product ID is wishlisted
  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
