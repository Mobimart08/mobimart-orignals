import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { ChevronRight } from 'lucide-react';

/* ==========================================================================
   RecentlyViewedStrip Component (Slice 5)
   - Consumes global RecentlyViewedContext to load list of visited phone cards
   - Horizontal slider strip with small thumbnail cards
   - Navigates viewports to clicked product details
   ========================================================================== */

export const RecentlyViewedStrip = ({ currentId }) => {
  const navigate = useNavigate();
  const { recentlyViewed } = useRecentlyViewed();

  // Exclude current product from display list
  const displayList = recentlyViewed.filter((item) => item.id !== currentId);

  if (displayList.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 uppercase tracking-wider">
          Recently Viewed
        </h3>
        <ChevronRight size={16} className="text-gray-400" />
      </div>

      {/* Horizontal Scroll wrapper */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-3">
          {displayList.map((prod) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => {
                navigate(`/product/${prod._id || prod.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-[#FAF9F6]/40 hover:bg-white border border-gray-150 hover:border-neutral-450 hover:shadow-sm shrink-0 flex items-center justify-center p-2.5 transition-all cursor-pointer relative"
              aria-label={`Open details for ${prod.name}`}
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="h-full w-auto object-contain object-bottom pointer-events-none select-none"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedStrip;
