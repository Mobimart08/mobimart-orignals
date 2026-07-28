import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

/* ==========================================================================
   SortBar Component
   - Renders the toolbar containing the Sort dropdown select and Filter trigger
   - Left: Dropdown toggle button displaying current active sort (Popular / Newest)
   - Right: Filter button displaying slider icon and opening the bottom drawer
   ========================================================================== */

export const SortBar = ({ activeSort = 'Popular', onSortChange, activeCondition = 'All', onConditionChange, onFilterClick }) => {
  
  // Determine what the select should display
  // If a specific condition (New/Used) is active, we can show that. 
  // Otherwise, show the active sort.
  let selectValue = activeSort;
  if (activeCondition === 'New') selectValue = 'Condition: New';
  if (activeCondition === 'Used') selectValue = 'Condition: Used';

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'Condition: New') {
      onConditionChange && onConditionChange('New');
    } else if (val === 'Condition: Used') {
      onConditionChange && onConditionChange('Used');
    } else {
      // If they pick a normal sort, clear the New/Used condition so the sort applies globally
      if (activeCondition === 'New' || activeCondition === 'Used') {
        onConditionChange && onConditionChange('All');
      }
      onSortChange && onSortChange(val);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] relative z-10 py-1.5 select-none">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Left: Unified Sort & Condition Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectValue}
              onChange={handleSelectChange}
              className="appearance-none flex items-center gap-1 pl-4 pr-8 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-neutral-800 bg-[#ECEFF2]/50 hover:bg-[#ECEFF2]/80 border border-neutral-200/10 rounded-full transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-gold-accent"
              aria-label="Change sorting or condition"
            >
              <optgroup label="Sort By">
                <option value="Popular">Sort: Popular</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Price Low-High">Sort: Price Low-High</option>
                <option value="Price High-Low">Sort: Price High-Low</option>
                <option value="Rating">Sort: Rating</option>
              </optgroup>
              <optgroup label="Condition">
                <option value="Condition: New">Show Only: New</option>
                <option value="Condition: Used">Show Only: Used</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Filter Button (Hidden on Desktop) */}
        <button
          type="button"
          onClick={onFilterClick}
          className="flex lg:hidden items-center gap-1.5 px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-neutral-800 bg-[#ECEFF2]/50 hover:bg-[#ECEFF2]/80 border border-neutral-200/10 rounded-full transition-all duration-200 cursor-pointer"
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
