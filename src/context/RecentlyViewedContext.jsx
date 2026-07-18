import React, { createContext, useContext, useState, useEffect } from 'react';

/* ==========================================================================
   RecentlyViewed Context
   - Manages state of recently viewed products on details pages
   - Deduplicates items, caps history at 10 items, and unshifts latest to top
   - Persists state in Local Storage under 'mobimart_recently_viewed'
   ========================================================================== */

const RecentlyViewedContext = createContext(undefined);

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = localStorage.getItem('mobimart_recently_viewed');
    return stored ? JSON.parse(stored) : [];
  });

  // Sync with Local Storage
  useEffect(() => {
    localStorage.setItem('mobimart_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Sync state if local storage changes from another window/event
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('mobimart_recently_viewed');
      if (stored) {
        try {
          setRecentlyViewed(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add product to viewed list
  const addView = (product) => {
    setRecentlyViewed((prevViewed) => {
      // Remove duplicate if it already exists
      const filtered = prevViewed.filter((item) => item.id !== product.id);
      
      // Unshift to the front of list
      const updated = [product, ...filtered];
      
      // Cap at 10 items
      if (updated.length > 10) {
        return updated.slice(0, 10);
      }
      return updated;
    });

    // Alert other listeners (e.g. drawers)
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 50);
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 50);
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
