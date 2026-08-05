import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/store/SearchBar';
import BrandTabs from '../components/store/BrandTabs';
import SortBar from '../components/store/SortBar';
import ProductGrid from '../components/store/ProductGrid';
import FloatingEyeButton from '../components/store/FloatingEyeButton';
import RecentlyViewedDrawer from '../components/store/RecentlyViewedDrawer';
import FilterDrawer from '../components/store/FilterDrawer';
import { SkeletonProduct } from '../components/ui/Skeletons';
import SEO from '../components/ui/SEO';
import { productsService } from '../api/services';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useWishlist } from '../context/WishlistContext';

export const Store = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { recentlyViewedCount } = useRecentlyViewed();
  const { toggleWishlist } = useWishlist();

  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);
  const [backendProducts, setBackendProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const category = searchParams.get('category') || 'All';
  const brand = searchParams.get('brand') || 'All';
  const productCondition = searchParams.get('productCondition') || searchParams.get('conditionType') || searchParams.get('condition') || 'All';
  const availability = searchParams.get('availability') || 'All';
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 150000;
  const sort = searchParams.get('sort') || 'Popular';
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = { limit: 12, page };
        if (searchQuery) queryParams.q = searchQuery;
        if (category && category !== 'All') queryParams.category = category;
        if (brand && brand !== 'All') queryParams.brand = brand;
        if (productCondition && productCondition !== 'All') queryParams.productCondition = productCondition;
        if (availability === 'In Stock') queryParams.inStock = 'true';

        queryParams.minPrice = minPrice;
        queryParams.maxPrice = maxPrice;

        if (sort === 'Price Low-High') queryParams.sort = 'price_asc';
        else if (sort === 'Price High-Low') queryParams.sort = 'price_desc';
        else if (sort === 'Rating') queryParams.sort = 'rating';
        else queryParams.sort = 'popularity';

        const res = await productsService.getAll(queryParams);
        
        console.log('========================');
        console.log('Store.jsx Fetch');
        console.log('========================');
        console.log('Current Page:', page);
        console.log('Current Limit:', queryParams.limit);
        console.log('API URL:', '/api/v1/products?' + new URLSearchParams(queryParams).toString());
        console.log('Response:');
        console.log('products.length:', res.data.data?.length || 0);
        console.log('pagination.currentPage:', res.data.pagination?.currentPage);
        console.log('pagination.totalPages:', res.data.pagination?.totalPages);
        console.log('pagination.totalCount:', res.data.pagination?.totalCount);
        console.log('========================');

        setBackendProducts(res.data.data || []);
        setPagination(res.data.pagination || null);
      } catch (err) {
        console.error('Failed to fetch products', err);
        showToast('Failed to load products', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, showToast, category, brand, productCondition, availability, minPrice, maxPrice, sort, searchQuery, page]);

  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === null || newParams[key] === undefined || newParams[key] === 'All' || newParams[key] === '') {
        updated.delete(key);
      } else {
        updated.set(key, newParams[key]);
      }
    });
    if (!newParams.page) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleProductDetailsOpen = (product) => {
    navigate(`/product/${product._id || product.id}`);
  };

  const catalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MobiMart Catalog',
    description: 'Browse smartphones, accessories, and more by brand, category, condition, price, and availability.',
    url: 'https://www.mobimart.in/store',
  };

  return (
    <MainLayout>
      <SEO
        title="Store Catalog"
        description="Browse new, used, refurbished, and open box devices plus accessories at MobiMart."
        path="/store"
        schema={catalogSchema}
      />
      <div className="flex flex-col w-full min-h-screen bg-[#FAF9F6] pb-24">
        <SearchBar value={searchQuery} onSearchChange={(q) => updateParams({ search: q })} />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BrandTabs activeBrand={brand} onBrandSelect={(value) => updateParams({ brand: value })} />
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 relative items-start">
          
          {/* Desktop Filter Sidebar is rendered inside FilterDrawer for lg screens */}
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            currentFilters={{
              brand,
              category,
              productCondition,
              availability,
              minPrice: Number(minPrice),
              maxPrice: Number(maxPrice),
              sort,
            }}
            onApplyFilters={(newFilters) => updateParams(newFilters)}
          />

          <div className="flex-1 flex flex-col w-full min-w-0">
            <SortBar 
              activeSort={sort} 
              onSortChange={(value) => updateParams({ sort: value })} 
              activeCondition={productCondition}
              onConditionChange={(value) => updateParams({ productCondition: value })}
              onFilterClick={() => setIsFilterOpen(true)} 
            />
            
            <div className="w-full mt-2 lg:mt-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)}
            </div>
          ) : backendProducts.length === 0 ? (
            <div className="w-full py-16 text-center select-none">
              <p className="text-sm font-bold text-neutral-800 mb-2">No matching products found</p>
              <p className="text-xs text-gray-500 mb-6">Try relaxing your search terms or clearing filters.</p>
              <button type="button" onClick={() => setSearchParams(new URLSearchParams())} className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-full shadow-md hover:bg-neutral-800 transition-all cursor-pointer">Reset All Filters</button>
            </div>
          ) : (
            <>
              {console.log('========================')}
              {console.log('Pagination Component')}
              {console.log('========================')}
              {console.log('pagination state:', pagination)}
              {console.log('page state:', page)}
              {console.log('render condition (pagination && pagination.totalPages > 1):', !!(pagination && pagination.totalPages > 1))}
              {console.log('Does the button mount?:', !!(pagination && pagination.totalPages > 1) ? 'YES' : 'NO')}
              <ProductGrid products={backendProducts} onViewDetails={handleProductDetailsOpen} onWishlistClick={toggleWishlist} />
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                  <button disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })} className="px-4 py-2 border border-gray-300 rounded-full text-xs font-bold disabled:opacity-50">Previous</button>
                  <span className="text-xs font-bold text-gray-500">Page {page} of {pagination.totalPages}</span>
                  <button disabled={page >= pagination.totalPages} onClick={() => {
                    console.log('========================');
                    console.log('Button Click: Next');
                    console.log('Old Page:', page);
                    console.log('New Page:', page + 1);
                    console.log('Updated URL params being set for page:', page + 1);
                    console.log('========================');
                    updateParams({ page: page + 1 });
                  }} className="px-4 py-2 border border-gray-300 rounded-full text-xs font-bold disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          )}
            </div>
          </div>
        </div>

        <FloatingEyeButton count={recentlyViewedCount} onClick={() => setIsRecentlyViewedOpen(true)} />

        <RecentlyViewedDrawer
          isOpen={isRecentlyViewedOpen}
          onClose={() => setIsRecentlyViewedOpen(false)}
          onViewDetails={(item) => {
            setIsRecentlyViewedOpen(false);
            handleProductDetailsOpen(item);
          }}
        />
      </div>
    </MainLayout>
  );
};

export default Store;
