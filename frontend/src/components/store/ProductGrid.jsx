import React from 'react';
import ProductCard from './ProductCard';

/* ==========================================================================
   ProductGrid Component
   - Renders a responsive grid of ProductCard components
   - Defaults to a 2-column layout on mobile, scaling up to 3 or 4 columns on desktop
   - Handles empty states if filtering results are blank
   ========================================================================== */

export const ProductGrid = ({ products = [], onViewDetails }) => {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center select-none">
        <p className="text-sm font-semibold text-gray-400">
          No certified devices found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF9F6] py-2 relative z-10">
      <div className="w-full">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
