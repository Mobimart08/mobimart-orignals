import React from 'react';
import { Search } from 'lucide-react';

/* ==========================================================================
   SearchBar Component
   - Renders the Store Search input capsule bar
   - Left: Search magnifying glass icon
   - Center: Input text field with custom placeholder
   ========================================================================== */

export const SearchBar = ({ onSearchChange, value = '' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full px-4 py-2 bg-[#FAF9F6] relative z-10">
      <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
        <div className="relative flex items-center bg-[#ECEFF2]/50 hover:bg-[#ECEFF2]/80 border border-neutral-200/20 focus-within:border-gold-accent focus-within:bg-white rounded-full px-4 py-2 sm:py-2.5 shadow-soft-ui transition-all duration-305 group">
          {/* Left: Search Icon */}
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-gold-accent shrink-0 select-none mr-2.5" />

          {/* Center: Input area */}
          <input
            type="text"
            value={value}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search iPhones, Samsung, Pixel..."
            className="w-full bg-transparent text-[11px] sm:text-sm text-neutral-800 placeholder-gray-400 focus:outline-none h-5"
            aria-label="Search items"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
