import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, CreditCard, Check, ArrowRight, ShieldCheck, Lock, Truck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/* ==========================================================================
   StickyCTA Component
   - "Add to Cart" -> adds item to cart & shows toast
   - "Buy Now" -> adds item to cart & navigates to /checkout
   ========================================================================== */

export const StickyCTA = ({ product, selectedStorage, selectedColor, selectedRam }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const resolveVariants = () => {
    const storage  = selectedStorage || (product.storageOptions?.[0] ?? null);
    const colorObj = selectedColor   || (product.colorOptions?.[0]  ?? null);
    const colorName = colorObj?.name ?? null;
    const ram      = selectedRam     || (product.ram?.[0]           ?? null);
    return { storage, colorName, ram };
  };

  const handleAddToCart = () => {
    const { storage, colorName, ram } = resolveVariants();
    addToCart(product, storage, colorName, 1, ram);
    const parts = [product.name];
    if (storage) parts.push(storage);
    if (colorName) parts.push(colorName);
    if (ram) parts.push(ram);
    showToast('cart', `${parts.join(' · ')} added to cart`);
  };

  const handleBuyNow = () => {
    const { storage, colorName, ram } = resolveVariants();
    addToCart(product, storage, colorName, 1, ram);
    navigate('/checkout');
  };

  const content = (
    <>
      {/* Toast notification */}
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

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/50 pt-3 sm:pt-4 pb-[max(env(safe-area-inset-bottom),12px)] sm:pb-[max(env(safe-area-inset-bottom),16px)] px-4 sm:px-6 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] select-none animate-slide-up transition-all duration-300">
        <div className="max-w-5xl mx-auto flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4">

            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">
                {[
                  selectedColor?.name || product.colorOptions?.[0]?.name || null,
                  selectedStorage     || product.storageOptions?.[0]     || null,
                  selectedRam         || product.ram?.[0]                || null,
                ].filter(Boolean).join(' · ') || 'Select options'}
              </span>
              <span className="text-base sm:text-lg font-black text-neutral-950 leading-none">
              ₹{typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
              </span>
            </div>

          <div className="flex-1 md:flex-initial flex items-center gap-3 sm:gap-4 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-6 py-3 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.97]"
              aria-label="Add product to shopping cart"
            >
              <ShoppingCart size={14} strokeWidth={2.4} />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none group active:scale-[0.98]"
              aria-label="Purchase product now"
            >
              <span>Buy Now</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          </div>
          
          {/* Secure Checkout Badges grid row */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 border-t border-gray-100/50 pt-2.5 mt-0.5 text-[8.5px] sm:text-[9px] text-gray-400 font-bold">
            <span className="flex items-center gap-1">
              <Lock size={10} className="text-[#C5A880]" />
              <span>Secure Payment</span>
            </span>
            <span className="text-neutral-200">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={10} className="text-[#C5A880]" />
              <span>Certified Devices</span>
            </span>
            <span className="text-neutral-200">|</span>
            <span className="flex items-center gap-1">
              <Truck size={10} className="text-[#C5A880]" />
              <span>Fast Delivery</span>
            </span>
            <span className="text-neutral-200">|</span>
            <span className="flex items-center gap-1">
              <RefreshCw size={10} className="text-[#C5A880]" />
              <span>Easy Returns</span>
            </span>
          </div>

        </div>
      </div>
    </>
  );

  if (!isMounted) return null;
  return createPortal(content, document.body);
};

export default StickyCTA;
