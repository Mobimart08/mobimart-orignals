import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

/* ==========================================================================
   SortBar Component
   - Renders the toolbar containing the Sort dropdown select and Filter trigger
   - Left: Dropdown toggle button displaying current active sort (Popular / Newest)
   - Right: Filter button displaying slider icon and opening the bottom drawer
   ========================================================================== */

export const SortBar = ({ activeSort = 'Popular', onSortChange, onFilterClick }) => {
  const toggleSort = () => {
    if (onSortChange) {
      onSortChange(activeSort === 'Popular' ? 'Newest' : 'Popular');
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] relative z-10 py-1.5 select-none">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* Left: Sort Dropdown */}
        <button
          type="button"
          onClick={toggleSort}
          className="flex items-center gap-1 px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-neutral-800 bg-[#ECEFF2]/50 hover:bg-[#ECEFF2]/80 border border-neutral-200/10 rounded-full transition-all duration-200 cursor-pointer"
          aria-label={`Change sorting, current: ${activeSort}`}
        >
          <span>Sort: {activeSort}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-600 transition-transform duration-200" />
        </button>

        {/* Right: Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-1.5 px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-neutral-800 bg-[#ECEFF2]/50 hover:bg-[#ECEFF2]/80 border border-neutral-200/10 rounded-full transition-all duration-200 cursor-pointer"
          aria-label="Open filters bottom sheet"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-600" />
          <span>Filter</span>
        </button>

      </div>
    </div>
  );
};

export default SortBar;
