import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/store/SearchBar';
import CategoryTabs from '../components/store/CategoryTabs';
import SortBar from '../components/store/SortBar';
import ProductGrid from '../components/store/ProductGrid';
import FloatingEyeButton from '../components/store/FloatingEyeButton';
import RecentlyViewedDrawer from '../components/store/RecentlyViewedDrawer';
import FilterDrawer from '../components/store/FilterDrawer';
import { SkeletonProduct } from '../components/ui/Skeletons';
import SEO from '../components/ui/SEO';
import { products } from '../data/products';

export const Store = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer visibility states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);

  // Active filters criteria state
  const [filters, setFilters] = useState({
    minPrice: 10000,
    maxPrice: 150000,
    brand: 'All',
    storage: 'All',
    condition: 'All',
    sortBy: 'Popular',
  });

  const [recentlyViewedCount, setRecentlyViewedCount] = useState(0);

  // Sync Floating Eye badge count on load
  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem('mobimart_recently_viewed');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setRecentlyViewedCount(list.length);
        } catch (e) {
          console.error(e);
        }
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  // Trigger skeleton shimmer on category, sorting or query alterations
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, activeSort, filters]);

  // Dynamic navigation handler to PDP
  const handleProductDetailsOpen = (product) => {
    navigate(`/product/${product.id}`);
  };

  // Filter & Sort Logic using shared database products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.specs.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert price string "₹89,999" -> 89999
    const priceNumeric = parseInt(product.price.replace(/[^\d]/g, ''), 10);
    const matchesMinPrice = priceNumeric >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice >= 150000 || priceNumeric <= filters.maxPrice;
    
    // Condition check matches filters.condition (All, New, Used)
    const matchesCondition = filters.condition === 'All' || product.conditionType === filters.condition;
    
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesCondition;
  });

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "MobiMart Smartphone Catalog",
    "description": "Browse and search through premium certified pre-owned and refurbished Apple iPhones, Samsung Galaxy, and Google Pixel smartphones.",
    "url": "https://www.mobimart.in/store"
  };

  return (
    <MainLayout>
      <SEO 
        title="Store Catalog" 
        description="Browse premium certified smartphones, refurbished iPhones, Samsung Galaxy, Google Pixels at MobiMart."
        path="/store"
        schema={catalogSchema}
      />
      <div className="flex flex-col w-full min-h-screen bg-[#FAF9F6] pb-24">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />

        {/* Category Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onCategorySelect={setActiveCategory} 
        />

        {/* Sort & Filter Bar */}
        <SortBar 
          activeSort={activeSort} 
          onSortChange={setActiveSort} 
          onFilterClick={() => setIsFilterOpen(true)} 
        />

        {/* Product Grid / Skeleton load deck */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProduct key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts} 
              onViewDetails={handleProductDetailsOpen} 
            />
          )}
        </div>

        {/* Floating Eye Button */}
        <FloatingEyeButton 
          count={recentlyViewedCount} 
          onClick={() => setIsRecentlyViewedOpen(true)} 
        />

        {/* Drawers / Bottom Sheets */}
        {/* Recently Viewed drawer */}
        <RecentlyViewedDrawer
          isOpen={isRecentlyViewedOpen}
          onClose={() => setIsRecentlyViewedOpen(false)}
          onViewDetails={(item) => {
            setIsRecentlyViewedOpen(false);
            handleProductDetailsOpen(item);
          }}
        />

        {/* Filter Settings drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          currentFilters={filters}
          onApplyFilters={setFilters}
        />
      </div>
    </MainLayout>
  );
};

export default Store;
