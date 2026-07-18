import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

/* ==========================================================================
   ProductInfo Component
   - Renders the primary detail headers for the Product Detail Page (Slice 1)
   - Certified condition badge label
   - Product name, star ratings, and verified buyer count
   - Main price, original price, and active discount badge
   ========================================================================== */

export const ProductInfo = ({ product }) => {
  return (
    <div className="w-full flex flex-col items-start text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui">
      
      {/* 1. Condition certified badge */}
      <span className="inline-block px-3 py-1 text-[9px] sm:text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-250/30 rounded-full mb-3 uppercase tracking-wide">
        {product.condition || 'Certified Like New'}
      </span>

      {/* 2. Product Name Title */}
      <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight mb-2 tracking-tight">
        {product.name}
      </h1>

      {/* 3. Rating & Verified Buyers row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Star Rating */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-neutral-800 bg-[#ECEFF2]/40 px-2 py-0.5 rounded">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" strokeWidth={0} />
          <span>{product.rating || '4.8'}</span>
        </div>
        
        {/* Review count */}
        <span className="text-[10.5px] sm:text-xs font-bold text-gray-400">
          ({product.reviewCount || '421'} Reviews)
        </span>
        
        <span className="text-gray-300 select-none">|</span>
        
        {/* Verified Badge */}
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-green-600 font-extrabold">
          <ShieldCheck className="w-3.5 h-3.5 text-green-505" strokeWidth={2.4} />
          <span>Verified Buyers</span>
        </div>
      </div>

      {/* 4. Pricing Row */}
      <div className="flex items-baseline gap-2.5">
        {/* Current Discounted Price */}
        <span className="text-xl sm:text-2xl font-black text-neutral-950">
          {product.price}
        </span>
        
        {/* Original Strike-through Price */}
        {product.originalPrice && (
          <span className="text-xs sm:text-sm text-gray-400 font-semibold line-through">
            {product.originalPrice}
          </span>
        )}

        {/* Discount Tag */}
        {product.discount && (
          <span className="px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-extrabold text-amber-600 bg-amber-50 rounded">
            {product.discount}
          </span>
        )}
      </div>

      {/* Inclusive Tax subtext */}
      <p className="text-[9.5px] sm:text-[10.5px] text-gray-400 font-bold mt-1 tracking-tight">
        Inclusive of all taxes
      </p>

    </div>
  );
};

export default ProductInfo;
