import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { ChevronRight, Star } from 'lucide-react';

/* ==========================================================================
   DashboardRecentlyViewed Component
   - Pulls recent view history from RecentlyViewedContext
   - Displays compact product cards in a horizontal swipeable container
   ========================================================================== */

export const DashboardRecentlyViewed = () => {
  const navigate = useNavigate();
  const { recentlyViewed } = useRecentlyViewed();

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null; // hide if history is clean
  }

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider flex items-center gap-1">
          <span>Recently Viewed</span>
        </h3>
        <ChevronRight size={15} className="text-gray-400" />
      </div>

      {/* Slider deck */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-stretch gap-3.5">
          {recentlyViewed.map((prod) => {
            return (
              <div 
                key={prod.id}
                onClick={() => {
                  navigate(`/product/${prod.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-[125px] sm:w-[145px] bg-white border border-gray-150/40 rounded-2xl p-3 shadow-soft-ui flex flex-col justify-between shrink-0 hover:border-neutral-350 transition-all cursor-pointer text-left active:scale-[0.98]"
              >
                {/* Thumbnail */}
                <div className="bg-[#FAF9F6]/40 border border-gray-100 rounded-lg aspect-square w-full flex items-center justify-center p-2.5 overflow-hidden mb-2">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-auto object-contain object-bottom pointer-events-none"
                  />
                </div>

                {/* Info details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-0.5">
                      {prod.brand}
                    </span>
                    <h4 className="text-[10px] sm:text-xs font-black text-neutral-950 truncate leading-tight mb-1">
                      {prod.name}
                    </h4>
                  </div>
                  
                  {/* Rating & Price */}
                  <div className="flex items-center justify-between gap-1.5 mt-1 border-t border-gray-100/50 pt-1.5">
                    <span className="text-[10.5px] font-black text-neutral-950 leading-none">
                      {prod.price}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star size={8} className="fill-amber-400 text-amber-400" />
                      <span className="text-[7.5px] font-bold text-neutral-600">
                        {prod.rating}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DashboardRecentlyViewed;
