import React, { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { brandService, categoryService } from '../../api/services';

const PRODUCT_CONDITIONS = ['All', 'New', 'Used', 'Refurbished', 'Open Box'];
const AVAILABILITY_OPTIONS = ['All', 'In Stock', 'Out of Stock'];

export const FilterDrawer = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || 150000);
  const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || 'All');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || 'All');
  const [selectedCondition, setSelectedCondition] = useState(currentFilters.productCondition || currentFilters.condition || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState(currentFilters.availability || 'All');
  const [selectedSort, setSelectedSort] = useState(currentFilters.sortBy || currentFilters.sort || 'Popular');

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);

  useEffect(() => {
    setMinPrice(currentFilters.minPrice || 0);
    setMaxPrice(currentFilters.maxPrice || 150000);
    setSelectedBrand(currentFilters.brand || 'All');
    setSelectedCategory(currentFilters.category || 'All');
    setSelectedCondition(currentFilters.productCondition || currentFilters.condition || 'All');
    setSelectedAvailability(currentFilters.availability || 'All');
    setSelectedSort(currentFilters.sortBy || currentFilters.sort || 'Popular');
  }, [currentFilters, isOpen]); // isOpen included so mobile drawer resets to current state on open

  useEffect(() => {
    brandService.getAll().then((res) => {
      setBrands([{ name: 'All', _id: 'All' }, ...(res.data.data || [])]);
    }).catch((err) => console.error(err));

    categoryService.getAll().then((res) => {
      setCategories([{ name: 'All', _id: 'All' }, ...(res.data.data || [])]);
    }).catch((err) => console.error(err));
  }, []);

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(150000);
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedAvailability('All');
    setSelectedSort('Popular');
    // For desktop, auto-apply on reset
    onApplyFilters?.({
      minPrice: 0, maxPrice: 150000, brand: 'All', category: 'All',
      productCondition: 'All', availability: 'All', sort: 'Popular',
    });
  };

  const handleApply = () => {
    onApplyFilters?.({
      minPrice,
      maxPrice,
      brand: selectedBrand,
      category: selectedCategory,
      productCondition: selectedCondition,
      availability: selectedAvailability,
      sort: selectedSort,
    });
    if (onClose) onClose();
  };

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}${val >= 150000 ? '+' : ''}`;

  // Reusable Filter Content
  const renderFilterContent = () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col text-left py-1">
        <button type="button" onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex items-center justify-between w-full text-left py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Category</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <span className="lg:hidden">{selectedCategory}</span>
            {isCategoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </button>
        {isCategoryOpen && (
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => {
              const catValue = category.name;
              return (
              <button key={category._id || 'all-cat'} onClick={() => setSelectedCategory(catValue)} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedCategory === catValue ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm' : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)]'}`}>
                {category.name}
              </button>
            )})}
          </div>
        )}
      </div>

      <div className="flex flex-col text-left py-1">
        <button type="button" onClick={() => setIsBrandOpen(!isBrandOpen)} className="flex items-center justify-between w-full text-left py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Brand</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <span className="lg:hidden">{selectedBrand}</span>
            {isBrandOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </button>
        {isBrandOpen && (
          <div className="flex flex-wrap gap-2 mt-2">
            {brands.map((brand) => {
              const brandValue = brand.name;
              return (
              <button key={brand._id || 'all-brand'} onClick={() => setSelectedBrand(brandValue)} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedBrand === brandValue ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm' : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)]'}`}>
                {brand.name}
              </button>
            )})}
          </div>
        )}
      </div>

      <div className="flex flex-col text-left py-1">
        <span className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-2">Price Range</span>
        <div className="flex items-center justify-between text-[11px] font-extrabold text-neutral-800 mb-4 bg-[#ECEFF2]/30 px-3 py-1.5 rounded-lg border border-neutral-100">
          <span>{formatCurrency(minPrice)}</span>
          <span>{formatCurrency(maxPrice)}</span>
        </div>
        <div className="relative w-full h-8 flex items-center px-1">
          <div className="absolute left-1.5 right-1.5 h-1 bg-neutral-150 rounded-full z-0 pointer-events-none"></div>
          <div className="absolute h-1 bg-gold-accent rounded-full z-10 pointer-events-none" style={{ left: `${(minPrice / 150000) * 100}%`, right: `${100 - (maxPrice / 150000) * 100}%` }}></div>
          <input type="range" min="0" max="150000" step="5000" value={minPrice} onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 5000))} className="absolute inset-x-0 w-full h-1 opacity-0 z-20 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto" style={{ pointerEvents: 'none' }} />
          <input type="range" min="0" max="150000" step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 5000))} className="absolute inset-x-0 w-full h-1 opacity-0 z-20 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto" style={{ pointerEvents: 'none' }} />
          <div className="absolute w-4 h-4 bg-white border-2 border-gold-accent rounded-full shadow z-15 pointer-events-none" style={{ left: `calc(${(minPrice / 150000) * 100}% - 8px)` }}></div>
          <div className="absolute w-4 h-4 bg-white border-2 border-gold-accent rounded-full shadow z-15 pointer-events-none" style={{ left: `calc(${(maxPrice / 150000) * 100}% - 8px)` }}></div>
        </div>
      </div>

      <div className="flex flex-col text-left py-1">
        <span className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-2">Condition</span>
        <div className="flex flex-wrap items-center gap-2">
          {PRODUCT_CONDITIONS.map((condition) => (
            <button key={condition} type="button" onClick={() => setSelectedCondition(condition)} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedCondition === condition ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm' : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)]'}`}>
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col text-left py-1">
        <span className="text-xs sm:text-sm font-extrabold text-neutral-950 mb-2">Availability</span>
        <div className="flex flex-wrap items-center gap-2">
          {AVAILABILITY_OPTIONS.map((availability) => (
            <button key={availability} type="button" onClick={() => setSelectedAvailability(availability)} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedAvailability === availability ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm' : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)]'}`}>
              {availability}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col text-left py-1 lg:hidden">
        <button type="button" onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center justify-between w-full text-left py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <span className="text-xs sm:text-sm font-extrabold text-neutral-950">Sort By</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <span>{selectedSort}</span>
            {isSortOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        </button>
        {isSortOpen && (
          <div className="flex flex-wrap gap-2 mt-2 pb-6">
            {['Popular', 'Price Low-High', 'Price High-Low', 'Rating'].map((sort) => (
              <button key={sort} onClick={() => setSelectedSort(sort)} className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg border transition-all cursor-pointer ${selectedSort === sort ? 'border-neutral-900 bg-neutral-950 text-white font-black shadow-sm' : 'border-gray-200 text-neutral-800 bg-white hover:bg-neutral-50'}`}>
                {sort}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center select-none lg:hidden">
          <div onClick={onClose} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1.5px] transition-opacity duration-300 animate-fade-in" aria-hidden="true"></div>
          <div className="bg-white w-full max-w-md rounded-t-[28px] shadow-premium relative z-10 flex flex-col max-h-[85vh] transition-transform duration-300 transform translate-y-0 animate-slide-up pb-safe-bottom border-t border-gray-100">
            <div className="w-10 h-1 bg-gray-250 rounded-full mx-auto my-3 shrink-0 cursor-pointer" onClick={onClose}></div>
            <div className="flex items-center justify-between px-5 pb-3.5 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-950">Filters</h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-neutral-800 hover:bg-neutral-100 transition-all cursor-pointer" aria-label="Close filters drawer">
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar overscroll-contain">
              {renderFilterContent()}
            </div>

            <div className="p-5 border-t border-gray-100 bg-[#FAF9F6] rounded-t-[18px] flex items-center justify-between gap-4">
              <button type="button" onClick={handleReset} className="flex-1 py-3 text-xs font-bold text-neutral-800 border border-neutral-250 hover:bg-neutral-100 rounded-full transition-all cursor-pointer shadow-sm text-center">Reset</button>
              <button type="button" onClick={handleApply} className="flex-1 py-3 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-full transition-all cursor-pointer shadow-md text-center">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex flex-col w-[260px] xl:w-[280px] shrink-0 bg-white rounded-2xl border border-gray-200/60 shadow-sm sticky top-24 self-start pb-6 h-fit max-h-[calc(100vh-120px)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#FAF9F6] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-neutral-900" />
            <h3 className="text-sm font-extrabold text-neutral-950">Filters</h3>
          </div>
          <button 
            type="button" 
            onClick={handleReset} 
            className="text-[10px] font-bold text-gray-400 hover:text-neutral-900 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar overscroll-contain">
          {renderFilterContent()}
        </div>
        <div className="px-5 pt-4 pb-2 border-t border-gray-100">
          <button type="button" onClick={handleApply} className="w-full py-3 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-850 rounded-xl transition-all cursor-pointer shadow-md text-center">
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
