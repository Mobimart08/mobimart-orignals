import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useWishlist } from '../../context/WishlistContext';

export const RecentlyViewedDrawer = ({ isOpen, onClose, onViewDetails }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
      // Trigger animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setIsRendered(false), 250);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  const list = recentlyViewed || [];

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    touchCurrentY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = () => {
    const delta = touchCurrentY.current - touchStartY.current;
    if (delta > 60) {
      onClose(); // Swipe down to close on mobile
    }
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto select-none p-3">
      {/* Backdrop Blur & Dark Overlay */}
      <div 
        onClick={onClose}
        className={`absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-250 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      
      {/* Centered Modal Container */}
      <div 
        className={`relative bg-white w-full max-w-[calc(100vw-24px)] md:max-w-[440px] max-h-[80vh] rounded-[24px] md:rounded-[28px] shadow-2xl flex flex-col overflow-hidden transition-all duration-250 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        {/* Sticky Header */}
        <div 
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white z-10 shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent shrink-0">
              <Eye size={16} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 flex items-center gap-2">
              Recently Viewed 
              <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {list.length}
              </span>
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            {list.length > 0 && (
              <button
                type="button"
                onClick={clearRecentlyViewed}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors px-2 py-1.5 rounded-md hover:bg-red-50 cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-100 text-gray-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 bg-[#FAF9F6] no-scrollbar">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center h-full">
              <EyeOff className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm text-gray-400 font-bold">
                Your historical views list is currently empty.
              </p>
              <p className="text-xs text-gray-400 mt-2 max-w-[220px]">
                Browse the store and click "View Details" on items to save them here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((item) => {
                const isSaved = isWishlisted(item._id || item.id);
                const pImage = item.images?.[0]?.url || item.image;
                const priceFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price);
                
                return (
                  <div key={item._id || item.id} className="flex items-center justify-between p-3 border border-gray-200/60 rounded-[20px] bg-white shadow-sm hover:border-gold-accent/40 transition-colors group">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-[#ECEFF2]/50 rounded-2xl flex items-center justify-center p-2.5 shrink-0">
                      <img src={pImage} alt={item.name} className="h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-100 opacity-90" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 mx-3">
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{item.brand || 'MobiMart'}</p>
                      <h4 className="text-[11.5px] sm:text-xs font-extrabold text-neutral-900 leading-snug line-clamp-1">{item.name}</h4>
                      <p className="text-[11.5px] sm:text-xs font-bold text-neutral-900 mt-0.5">{priceFormatted}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0 h-16 justify-between">
                      <button onClick={() => toggleWishlist(item)} className={`p-1 rounded-full bg-[#FAF9F6] hover:bg-red-50 transition-colors cursor-pointer ${isSaved ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`}>
                         <Heart size={13} className={isSaved ? 'fill-red-500' : ''} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => { if(onViewDetails) { onViewDetails(item); } }} className="px-3 py-1.5 text-[9.5px] sm:text-[10px] font-bold text-white bg-neutral-900 hover:bg-gold-accent rounded-lg transition-colors shadow-sm cursor-pointer">
                        Quick View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-3 z-10">
           <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors flex-1 text-center cursor-pointer">
             Close
           </button>
           <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gold-accent hover:bg-[#B59972] transition-colors flex-[2] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
             Continue Shopping <ArrowRight size={14} strokeWidth={2.5} />
           </button>
        </div>
      </div>
    </div>
  );

  // Mount directly to document.body, escaping all page scroll bounds and parent layout contexts
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default RecentlyViewedDrawer;
