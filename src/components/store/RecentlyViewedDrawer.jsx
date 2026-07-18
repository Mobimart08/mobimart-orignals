import React, { useEffect, useState } from 'react';
import { X, Heart, EyeOff } from 'lucide-react';
import Button from '../ui/Button';

/* ==========================================================================
   RecentlyViewedDrawer Component
   - Renders the Recently Viewed bottom sheet sliding drawer
   - Displays a scrollable list of up to 10 products saved in Local Storage
   - Each item has its thumbnail, name, specs, price, individual wishlist and "View" trigger
   ========================================================================== */

export const RecentlyViewedDrawer = ({ isOpen, onClose, onViewDetails }) => {
  const [list, setList] = useState([]);

  // Load list from Local Storage on open or storage events
  useEffect(() => {
    const loadList = () => {
      const stored = localStorage.getItem('mobimart_recently_viewed');
      if (stored) {
        try {
          setList(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setList([]);
      }
    };

    if (isOpen) {
      loadList();
    }

    window.addEventListener('storage', loadList);
    return () => window.removeEventListener('storage', loadList);
  }, [isOpen]);

  const handleClearAll = () => {
    localStorage.removeItem('mobimart_recently_viewed');
    setList([]);
    window.dispatchEvent(new Event('storage'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1.5px] transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
      ></div>

      {/* Drawer Body Sheet */}
      <div className="bg-white w-full max-w-md rounded-t-[28px] shadow-premium relative z-10 flex flex-col max-h-[82vh] transition-transform duration-300 transform translate-y-0 animate-slide-up pb-safe-bottom border-t border-gray-100">
        
        {/* Top: Drag handle indicator decoration */}
        <div className="w-10 h-1 bg-gray-250 rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={onClose}></div>

        {/* Header Row */}
        <div className="flex items-center justify-between px-5 pb-3.5 border-b border-gray-100">
          <h3 className="text-sm sm:text-base font-extrabold text-neutral-950">
            Recently Viewed
          </h3>
          <div className="flex items-center gap-3">
            {list.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[9.5px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-neutral-800 hover:bg-neutral-100 transition-all cursor-pointer"
              aria-label="Close recently viewed drawer"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Scrollable Products List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <EyeOff className="w-9 h-9 text-gray-300 mb-3" />
              <p className="text-xs text-gray-400 font-bold">
                Your historical views list is currently empty.
              </p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                Click "View Details" on store items to save them here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {list.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-gray-150/40 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.015)] relative group hover:border-gold-accent/40 transition-colors duration-200"
                >
                  {/* Left: Thumbnail image container */}
                  <div className="w-14 h-14 bg-[#ECEFF2]/50 rounded-xl flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-auto object-contain object-bottom select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100" 
                    />
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 min-w-0 mx-3 text-left">
                    <h4 className="text-[11.5px] sm:text-xs font-extrabold text-neutral-900 leading-snug line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold tracking-tight">
                      {item.specs}
                    </p>
                    <p className="text-[11px] sm:text-xs font-extrabold text-neutral-900 mt-0.5">
                      {item.price}
                    </p>
                  </div>

                  {/* Right: View Action & Heart toggle */}
                  <div className="flex flex-col items-end justify-between h-14 shrink-0 gap-1">
                    {/* Tiny Wishlist heart */}
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart size={14} className="transition-all active:opacity-80" strokeWidth={2.2} />
                    </button>
                    
                    {/* View Details button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewDetails) {
                          onViewDetails(item);
                        }
                      }}
                      className="px-3 py-1 text-[9.5px] sm:text-[10px] font-bold text-neutral-800 bg-[#FAF9F6]/80 hover:bg-white hover:text-gold-accent border border-neutral-250 rounded-lg hover:border-gold-accent transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-[#FAF9F6] rounded-t-[18px]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="w-full justify-center !py-2.5 sm:!py-3.5 text-xs font-bold shadow-sm"
          >
            View All Recently Viewed
          </Button>
        </div>

      </div>
    </div>
  );
};

export default RecentlyViewedDrawer;
