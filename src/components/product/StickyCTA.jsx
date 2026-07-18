import React, { useState, useCallback } from 'react';
import { ShoppingCart, CreditCard, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/* ==========================================================================
   StickyCTA Component
   - Sticky bottom action bar fixed at the bottom of the PDP viewport
   - "Add to Cart" → shows in-page toast confirmation (no browser alert)
   - "Buy Now" → adds to cart and navigates directly to /cart
   - Toast auto-dismisses after 2.5 seconds
   ========================================================================== */

export const StickyCTA = ({ product, selectedStorage, selectedColor }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); // { type: 'cart' | 'error', message }

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const resolveVariants = () => {
    const storage = selectedStorage || (product.storageOptions?.[0] ?? '128GB');
    const colorObj  = selectedColor  || (product.colorOptions?.[0]  ?? null);
    const colorName = colorObj?.name ?? 'Default';
    return { storage, colorName };
  };

  const handleAddToCart = () => {
    const { storage, colorName } = resolveVariants();
    addToCart(product, storage, colorName, 1);
    showToast('cart', `${product.name} · ${storage} · ${colorName} added to cart`);
  };

  const handleBuyNow = () => {
    const { storage, colorName } = resolveVariants();
    addToCart(product, storage, colorName, 1);
    navigate('/cart');
  };

  return (
    <>
      {/* ── In-page toast notification ─────────────────────────────────── */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out pointer-events-none ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}
        aria-live="polite"
      >
        {toast && (
          <div className="flex items-center gap-2.5 bg-neutral-950 text-white text-[11px] font-bold px-4 py-2.5 rounded-full shadow-xl whitespace-nowrap max-w-[90vw]">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Check size={11} strokeWidth={3} />
            </div>
            <span className="truncate">{toast.message}</span>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Bar ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 py-3 sm:py-4 px-4 sm:px-6 shadow-premium select-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

          {/* Left: Desktop-only product meta */}
          <div className="hidden md:flex flex-col text-left">
            <h4 className="text-xs font-black text-neutral-900 leading-none mb-0.5 truncate max-w-[240px]">
              {product.name}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">
              {selectedStorage || product.storageOptions?.[0] || ''} · {selectedColor?.name || product.colorOptions?.[0]?.name || 'Default'}
            </p>
            <span className="text-sm font-black text-neutral-900 mt-1 leading-none">
              {product.price}
            </span>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex-1 md:flex-initial flex items-center gap-3 sm:gap-4 justify-end">
            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-6 py-3 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.97]"
              aria-label="Add product to shopping cart"
            >
              <ShoppingCart size={14} strokeWidth={2.4} />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 sm:flex-initial px-8 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.97]"
              aria-label="Purchase product now"
            >
              <CreditCard size={14} />
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default StickyCTA;
