import React from 'react';

/* ==========================================================================
   CompactOrderCard Component
   - Lightweight read-only item row for the checkout page order review
   - Shows: thumbnail | brand/name | variant + qty | price
   ========================================================================== */

export const CompactOrderCard = ({ item }) => {
  const { product, selectedStorage, selectedColor, quantity } = item;

  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      {/* Product thumbnail */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FAF9F6] rounded-xl flex items-center justify-center border border-gray-100 shrink-0 p-1.5 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider leading-none">{product.brand?.name || product.brand}</span>
        <h4 className="text-xs font-extrabold text-neutral-950 truncate leading-tight">{product.name}</h4>
        <span className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wide">
          {selectedStorage} · {selectedColor} · Qty {quantity}
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end shrink-0">
        <span className="text-xs font-black text-neutral-950">{product.price}</span>
        {product.originalPrice && (
          <span className="text-[9px] text-gray-400 line-through font-semibold">{product.originalPrice}</span>
        )}
      </div>
    </div>
  );
};

export default CompactOrderCard;
