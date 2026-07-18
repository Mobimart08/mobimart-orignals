import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

/* ==========================================================================
   FilterDrawer Component
   - Renders the filter settings bottom sheet drawer matching Slice 2
   - Sections: Brand, Price Range (Gold Dual Slider), Storage, Condition, Sort By
   - Bottom CTAs: Reset button and Apply Filters button
   ========================================================================== */

export const FilterDrawer = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || 10000);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || 150000);
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || 'All');
  const [selectedStorage, setSelectedStorage] = useState(currentFilters.storage || 'All');
  const [selectedCondition, setSelectedCondition] = useState(currentFilters.condition || 'All');
  const [selectedSort, setSelectedSort] = useState(currentFilters.sortBy || 'Popular');

  const handleReset = () => {
    setMinPrice(10000);
    setMaxPrice(150000);
    setSelectedBrand('All');
    setSelectedStorage('All');
    setSelectedCondition('All');
    setSelectedSort('Popular');
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        minPrice,
        maxPrice,
        brand: selectedBrand,
        storage: selectedStorage,
        condition: selectedCondition,
        sortBy: selectedSort,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  // Format currency layout
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString('en-IN')}${val >= 150000 ? '+' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1.5px] transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
      ></div>

      {/* Drawer Body Sheet */}
      <div className="bg-white w-full max-w-md rounded-t-[28px] shadow-premium relative z-10 flex flex-col max-h-[85vh] transition-transform duration-300 transform translate-y-0 animate-slide-up pb-safe-bottom border-t border-gray-100">
        
        {/* Top: Drag handle decoration */}
        <div className="w-10 h-1 bg-gray-250 rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={onClose}></div>

        {/* Header Row */}
        <div className="flex items-center justify-between px-5 pb-3.5 border-b border-gray-100">
          <h3 className="text-sm sm:text-base font-extrabold text-neutral-950">
            Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-neutral-800 hover:bg-neutral-100 transition-all cursor-pointer"
            aria-label="Close filters drawer"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Scrollable Filters List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar flex flex-col gap-5">
          
          {/* Section 1: Brand Accordion trigger */}
          <button
            type="button"
            className="flex items-center justify-between w-full text-left py-2 border-b border-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Brand</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <span>{selectedBrand}</span>
              <ChevronRight size={14} />
            </div>
          </button>

          {/* Section 2: Price Range (Dual Slider) */}
          <div className="flex flex-col text-left py-1">
            <span className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-2">Price Range</span>
            
            <div className="flex items-center justify-between text-[11px] font-extrabold text-neutral-800 mb-4 bg-[#ECEFF2]/30 px-3 py-1.5 rounded-lg border border-neutral-100">
              <span>{formatCurrency(minPrice)}</span>
              <span>{formatCurrency(maxPrice)}</span>
            </div>

            {/* Premium Gold Slider Track Representation */}
            <div className="relative w-full h-8 flex items-center px-1">
              {/* Background grey track */}
              <div className="absolute left-1.5 right-1.5 h-1 bg-neutral-150 rounded-full z-0 pointer-events-none"></div>
              
              {/* Golden active segment track */}
              <div 
                className="absolute h-1 bg-gold-accent rounded-full z-10 pointer-events-none"
                style={{
                  left: `${((minPrice - 10000) / 140000) * 100}%`,
                  right: `${100 - ((maxPrice - 10000) / 140000) * 100}%`,
                }}
              ></div>

              {/* Slider thumbs using gold buttons */}
              {/* Min Thumb input */}
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={minPrice}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxPrice - 10000);
                  setMinPrice(val);
                }}
                className="absolute inset-x-0 w-full h-1 opacity-0 z-20 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                style={{ pointerEvents: 'none' }}
              />
              
              {/* Max Thumb input */}
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={maxPrice}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), minPrice + 10000);
                  setMaxPrice(val);
                }}
                className="absolute inset-x-0 w-full h-1 opacity-0 z-20 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                style={{ pointerEvents: 'none' }}
              />

              {/* Custom Knobs Layer */}
              <div 
                className="absolute w-4 h-4 bg-white border-2 border-gold-accent rounded-full shadow z-15 pointer-events-none"
                style={{ left: `calc(${((minPrice - 10000) / 140000) * 100}% - 8px)` }}
              ></div>
              <div 
                className="absolute w-4 h-4 bg-white border-2 border-gold-accent rounded-full shadow z-15 pointer-events-none"
                style={{ left: `calc(${((maxPrice - 10000) / 140000) * 100}% - 8px)` }}
              ></div>
            </div>
          </div>

          {/* Section 3: Storage Accordion */}
          <button
            type="button"
            className="flex items-center justify-between w-full text-left py-2 border-b border-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Storage</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <span>{selectedStorage}</span>
              <ChevronRight size={14} />
            </div>
          </button>

          {/* Section 4: Condition */}
          <div className="flex flex-col text-left py-1">
            <span className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-2">Condition</span>
            <div className="flex items-center gap-2">
              {['All', 'New', 'Used'].map((cond) => {
                const isSelected = selectedCondition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-4.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm'
                        : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)]'
                    }`}
                  >
                    {cond === 'All' ? 'All' : cond === 'New' ? 'Brand New' : 'Pre-Owned (Used)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Sort By Accordion */}
          <button
            type="button"
            className="flex items-center justify-between w-full text-left py-2 border-b border-gray-100 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Sort By</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
              <span>{selectedSort}</span>
              <ChevronRight size={14} />
            </div>
          </button>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-[#FAF9F6] rounded-t-[18px] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-3 text-xs font-bold text-neutral-800 border border-neutral-250 hover:bg-neutral-100 rounded-full transition-all cursor-pointer shadow-sm text-center"
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all cursor-pointer shadow-md text-center"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterDrawer;
