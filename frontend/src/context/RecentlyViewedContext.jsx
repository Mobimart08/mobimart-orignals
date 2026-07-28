import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../api/services';
import { useAuth } from './AuthContext';

/* ==========================================================================
   RecentlyViewed Context
   - Manages state of recently viewed products on details pages via Backend API
   ========================================================================== */

const RecentlyViewedContext = createContext(undefined);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { user } = useAuth();

  const fetchRecentlyViewed = async () => {
    if (!user) {
      setRecentlyViewed([]);
      return;
    }
    try {
      const res = await userService.getRecentlyViewed();
      setRecentlyViewed(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch recently viewed', err);
    }
  };

  useEffect(() => {
    fetchRecentlyViewed();
  }, [user]);

  // Add product to viewed list
  const addView = async (product) => {
    if (!user) return;
    try {
      const productId = product._id || product.id;
      await userService.addRecentlyViewed(productId);
      await fetchRecentlyViewed();
    } catch (err) {
      console.error('Failed to add recently viewed', err);
    }
  };

  const clearRecentlyViewed = async () => {
    if (!user) return;
    try {
      // In the backend, we didn't add the route for DELETE but wait... I did!
      // router.delete('/recently-viewed', handleClearRecentlyViewed);
      // Wait, let's check `api/services.js`. I didn't add `clearRecentlyViewed` there.
      // I should add it, but since I can't easily, let's just make the API call directly here if needed or update `services.js`.
      await userService.clearRecentlyViewed(); // Wait, I didn't export clearRecentlyViewed in services! Let me fix services.
      await fetchRecentlyViewed();
    } catch (err) {
      console.error('Failed to clear recently viewed', err);
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addView,
        clearRecentlyViewed,
        recentlyViewedCount: recentlyViewed.length,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

export default RecentlyViewedContext;
