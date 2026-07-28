import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { wishlistService } from '../api/services';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      const res = await wishlistService.getWishlist();
      setWishlistItems(res.data.data.items || []);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback((productId) => {
    return wishlistItems.some(
      (item) => item.product._id === productId || item.product.id === productId
    );
  }, [wishlistItems]);

  const toggleWishlist = useCallback(async (product) => {
    if (!user) {
      window.dispatchEvent(new Event('auth:unauthorized'));
      return;
    }
    const productId = product._id || product.id;
    try {
      if (isWishlisted(productId)) {
        await wishlistService.removeItem(productId);
      } else {
        await wishlistService.addItem(productId);
      }
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  }, [user, isWishlisted, fetchWishlist]);

  const normalizedWishlist = useMemo(
    () => wishlistItems.map(item => item.product || item),
    [wishlistItems]
  );

  const value = useMemo(() => ({
    wishlistItems: normalizedWishlist,
    toggleWishlist,
    isWishlisted,
    wishlistCount: wishlistItems.length,
  }), [normalizedWishlist, toggleWishlist, isWishlisted, wishlistItems.length]);

  return (
    <WishlistContext.Provider value={value}>
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
