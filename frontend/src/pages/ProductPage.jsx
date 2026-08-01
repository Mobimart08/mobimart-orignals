import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { productsService } from '../api/services';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import SEO from '../components/ui/SEO';

// Import newly created widgets
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import StorageSelector from '../components/product/StorageSelector';
import ColorSelector from '../components/product/ColorSelector';
import BatteryHealthCard from '../components/product/BatteryHealthCard';
import DeliveryChecker from '../components/product/DeliveryChecker';
import SpecsTabs from '../components/product/SpecsTabs';
import WarrantyBoxTabs from '../components/product/WarrantyBoxTabs';
import TrustBadges from '../components/product/TrustBadges';
import StickyCTA from '../components/product/StickyCTA';
import ProductReviews from '../components/product/ProductReviews';
import RelatedProducts from '../components/product/RelatedProducts';
import RecentlyViewedStrip from '../components/product/RecentlyViewedStrip';
import { SkeletonProduct } from '../components/ui/Skeletons';

/* ==========================================================================
   ProductPage Component
   - Main page coordinator for the Product Detail Page (PDP)
   - Loads product data dynamically using the URL id param via API
   - Coordinates selectors states (active color and storage chips)
   - Mounts the Product Gallery, Specs Tabs, and Reviews
   ========================================================================== */

export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addView } = useRecentlyViewed();

  // State controls for interactive attributes
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productsService.getById(id);
        const fetchedProduct = res.data.data;
        setProduct(fetchedProduct);
        
        addView(fetchedProduct);

        // Default to first option
        if (fetchedProduct.storageOptions && fetchedProduct.storageOptions.length > 0) {
          setSelectedStorage(fetchedProduct.storageOptions[0]);
        }
        if (fetchedProduct.colorOptions && fetchedProduct.colorOptions.length > 0) {
          setSelectedColor(fetchedProduct.colorOptions[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0]?.url || product.image,
    "description": product.description || `Buy ${product.name} at MobiMart`,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || product.brand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  } : null;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="w-full min-h-[70vh] flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <SEO title="Product Not Found" />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 select-none bg-[#FAF9F6]">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-150/40 mb-5 shadow-sm">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
            The device ID you are searching for is invalid or has been archived from MobiMart's inventory.
          </p>
          <Link
            to="/store"
            className="px-6 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all shadow-md cursor-pointer"
          >
            Back to Store
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Ensure arrays exist for components
  const images = product.images?.map(img => img.url) || [product.image];
  const brandName = product.brand?.name || product.brand;

  return (
    <MainLayout>
      <SEO 
        title={product.name} 
        description={`${product.name} specs: ${product.specs}. Buy certified refurbished smartphone at MobiMart with 12 months warranty.`}
        path={`/product/${product._id || product.id}`}
        type="product"
        schema={productSchema}
      />
      <div className="w-full bg-[#FAF9F6] pb-24 px-4 sm:px-6 md:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="max-w-5xl mx-auto py-4 text-left select-none">
          <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
            <Link to="/store" className="hover:text-gold-accent transition-colors">Store</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-500">{brandName}</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-neutral-900 font-black">{product.name}</span>
          </p>
        </div>

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Product Image Gallery (span 5) - NOT sticky as requested */}
          <div className="md:col-span-5 w-full">
            <ProductGallery images={images} />
          </div>

          {/* Right Column: Attribute Selectors & Info (span 7) */}
          <div className="md:col-span-7 w-full flex flex-col gap-5">
            {/* Header info card */}
            <ProductInfo product={product} />

            {/* Storage selector chips */}
            {product.storageOptions && product.storageOptions.length > 0 && (
              <StorageSelector
                options={product.storageOptions}
                selected={selectedStorage}
                onChange={setSelectedStorage}
              />
            )}

            {/* Color selector circles */}
            {product.colorOptions && product.colorOptions.length > 0 && (
              <ColorSelector
                options={product.colorOptions}
                selected={selectedColor}
                onChange={setSelectedColor}
              />
            )}

            {/* Battery health percentage status (Only visible for Used devices) */}
            {['Used', 'Refurbished', 'Open Box'].includes(product.productCondition || product.conditionType) && product.batteryHealth && (
              <BatteryHealthCard health={product.batteryHealth} />
            )}

            {/* Mock delivery checkers zip input */}
            <DeliveryChecker />

            {/* Tabbed Specifications & Inspection checklist panel */}
            <SpecsTabs product={product} />

            {/* Warranty & In the Box tabs summary */}
            <WarrantyBoxTabs product={product} />

            {/* Trust credentials badges */}
            <TrustBadges />

            {/* Customer reviews and distribution summary */}
            <ProductReviews product={product} />

            {/* Related products suggestions grid */}
            <RelatedProducts id={product._id || product.id} />

            {/* Horizontal Recently Viewed item slides */}
            <RecentlyViewedStrip currentId={product._id || product.id} />
          </div>

        </div>

      </div>

      {/* Sticky Bottom CTA Actions */}
      <StickyCTA 
        product={product} 
        selectedStorage={selectedStorage} 
        selectedColor={selectedColor} 
      />
    </MainLayout>
  );
};

export default ProductPage;

