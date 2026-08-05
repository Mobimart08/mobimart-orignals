import React, { useState, memo } from 'react';
import { Trash2, Heart, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

/* ==========================================================================
   CartItemCard Component
   - Renders a single shopping cart item card row
   - Displays dynamic variants (capacity, selected color) and prices
   - Mounts the animated QuantitySelector stepper
   ========================================================================== */

const CartItemCardComponent = ({ item, onUpdateQuantity, onRemove }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { product, selectedStorage, selectedColor, selectedRam, quantity } = item;

  const liked = isWishlisted(product.id || product._id);

  const handleMoveToWishlist = () => {
    toggleWishlist(product);
    onRemove(product.id || product._id, selectedStorage, selectedColor, selectedRam);
  };

  return (
    <div className="w-full flex items-start gap-3 p-3 border border-gray-150/40 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.015)] select-none text-left relative group hover:border-gold-accent/30 transition-colors">
      
      {/* 1. Left product thumbnail image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF9F6]/80 rounded-[14px] flex items-center justify-center shrink-0 p-2 overflow-hidden border border-gray-100 group-hover:bg-[#ECEFF2]/50 transition-colors">
        <img
          src={product.image || (product.images && product.images[0]?.url)}
          alt={product.name}
          className="h-full w-auto object-contain object-bottom mix-blend-multiply"
        />
      </div>

      {/* 2. Middle Content descriptions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
        
        {/* Condition certified badge tag */}
        <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded mb-1.5 ${
          product.conditionType === 'New' 
            ? 'bg-neutral-900 text-white' 
            : 'bg-amber-50 text-amber-600 border border-amber-250/20'
        }`}>
          {product.conditionType === 'New' ? 'Sealed Box' : 'Certified'}
        </span>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950 truncate leading-tight">
          {product.name}
        </h4>

        {/* Variant summary list */}
        <p className="text-[9.5px] sm:text-[10.5px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
          {[selectedStorage, selectedColor, selectedRam].filter(Boolean).join(' • ')}
        </p>

        {/* Pricing Row */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-black text-neutral-950">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="text-[9.5px] font-extrabold text-amber-600">
              {product.discount}
            </span>
          )}
        </div>
        </div>

        {/* Stepper & Actions bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-1.5 w-full">
          {/* Quantity Stepper selector */}
          <QuantitySelector 
            value={quantity}
            onChange={(newVal) => onUpdateQuantity(product.id || product._id, selectedStorage, selectedColor, selectedRam, newVal)}
          />

          {/* Quick operations */}
          <div className="flex items-center gap-1.5 text-gray-400">
            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={handleMoveToWishlist}
              className="p-1.5 hover:bg-neutral-100 hover:text-[#C5A880] rounded-full transition-all cursor-pointer"
              title="Move to Wishlist"
            >
              <Heart size={14} className={liked ? 'fill-[#C5A880] text-[#C5A880]' : ''} strokeWidth={2.4} />
            </button>
            {/* Trash Bin */}
            <button
              type="button"
              onClick={() => onRemove(product.id || product._id, selectedStorage, selectedColor, selectedRam)}
              className="p-1.5 hover:bg-neutral-100 hover:text-red-500 rounded-full transition-all cursor-pointer"
              title="Remove Item"
            >
              <Trash2 size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ==========================================================================
   QuantitySelector Subcomponent
   - Plus / Minus stepper inputs
   - Subtle scale-down click bounce animations (active:scale-88)
   ========================================================================== */

export const QuantitySelector = ({ value = 1, onChange }) => {
  const [clickState, setClickState] = useState({ minus: false, plus: false });

  const handleDecrease = () => {
    if (value > 1) {
      setClickState((prev) => ({ ...prev, minus: true }));
      setTimeout(() => setClickState((prev) => ({ ...prev, minus: false })), 150);
      onChange && onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    setClickState((prev) => ({ ...prev, plus: true }));
    setTimeout(() => setClickState((prev) => ({ ...prev, plus: false })), 150);
    onChange && onChange(value + 1);
  };

  return (
    <div className="flex items-center bg-[#FAF9F6] border border-gray-200/50 rounded-xl px-1 py-0.5 shadow-sm scale-95 origin-left select-none">
      
      {/* Minus Button */}
      <button
        type="button"
        disabled={value <= 1}
        onClick={handleDecrease}
        className={`w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-neutral-900 hover:bg-white transition-all cursor-pointer ${
          clickState.minus ? 'scale-85 bg-white' : 'scale-100'
        } ${value <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
        aria-label="Decrease quantity"
      >
        <Minus size={11} strokeWidth={2.8} />
      </button>

      {/* Numerical count */}
      <span className="text-[11.5px] font-black text-neutral-950 w-7 text-center">
        {value}
      </span>

      {/* Plus Button */}
      <button
        type="button"
        onClick={handleIncrease}
        className={`w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-neutral-900 hover:bg-white transition-all cursor-pointer ${
          clickState.plus ? 'scale-85 bg-white' : 'scale-100'
        }`}
        aria-label="Increase quantity"
      >
        <Plus size={11} strokeWidth={2.8} />
      </button>

    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.selectedStorage === nextProps.item.selectedStorage &&
    prevProps.item.selectedColor === nextProps.item.selectedColor &&
    prevProps.item.selectedRam === nextProps.item.selectedRam &&
    (prevProps.item.product?._id === nextProps.item.product?._id || prevProps.item.product?.id === nextProps.item.product?.id)
  );
};

export const CartItemCard = memo(CartItemCardComponent, areEqual);
export default CartItemCard;
