import React, { useState } from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

/* ==========================================================================
   ProductCard Component
   - Renders a single product card exactly matching the presentation board
   - Top-right: Interactive Wishlist Heart toggle
   - Center: Product Image container
   - Details: Name, Variant/Specs, Price, "Certified" check badge
   - Bottom: "View Details" action button
   ========================================================================== */

export const ProductCard = ({ product, onViewDetails, isWishlistedInit = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInit);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-150/40 rounded-2xl p-3 sm:p-4 flex flex-col relative text-left shadow-soft-ui group hover:shadow-premium hover:border-[#C5A880]/30 transition-all duration-300 cursor-pointer select-none"
    >
      {/* Wishlist Button (Heart Icon) */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-all cursor-pointer active:opacity-85"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          size={16} 
          className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} 
          strokeWidth={isWishlisted ? 0 : 2.2} 
        />
      </button>

      {/* Product Image Container */}
      <div className="w-full aspect-[4/3] sm:aspect-square flex items-center justify-center p-2 mb-3 bg-[#ECEFF2]/40 rounded-xl overflow-hidden relative group-hover:bg-[#ECEFF2]/60 transition-colors">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-auto object-contain object-bottom select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100 filter drop-shadow-[-2px_4px_6px_rgba(0,0,0,0.06)]"
          />
        ) : (
          <div className="w-12 h-12 bg-neutral-200 rounded-lg flex items-center justify-center text-xs text-gray-400 font-bold select-none">
            No Img
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h4 className="text-xs sm:text-[13.5px] font-extrabold text-neutral-900 leading-tight mb-0.5 line-clamp-1 group-hover:text-gold-accent transition-colors">
            {product.name}
          </h4>
          
          {/* Variant / Specs */}
          <p className="text-[9px] sm:text-[10.5px] text-gray-400 font-bold tracking-tight mb-2">
            {product.specs}
          </p>
        </div>

        <div>
          {/* Price */}
          <p className="text-xs sm:text-[13.5px] font-extrabold text-neutral-900 mb-1">
            {product.price}
          </p>

          {/* Certification Badge Row */}
          <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold mb-3 select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80 fill-amber-500/10" strokeWidth={2.4} />
            <span>Certified</span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full py-1.5 sm:py-2 text-[9.5px] sm:text-[11px] font-bold text-neutral-800 bg-[#FAF9F6]/80 hover:bg-white border border-neutral-200/50 hover:border-gold-accent hover:text-gold-accent rounded-lg transition-all duration-200 cursor-pointer text-center select-none shadow-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
