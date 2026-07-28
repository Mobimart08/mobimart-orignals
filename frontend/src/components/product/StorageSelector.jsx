import React from 'react';

/* ==========================================================================
   StorageSelector Component
   - Renders interactive storage capacity chips (128GB, 256GB, 512GB, 1TB)
   - Highlights the selected chip with gold outline accent border styling
   ========================================================================== */

export const StorageSelector = ({ options = ['128GB', '256GB', '512GB', '1TB'], selected, onChange }) => {
  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-2.5">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">
        Storage
      </h3>
      
      {/* Storage chips grid list */}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const isSelected = option === selected;
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange && onChange(option)}
              className={`px-4.5 py-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-gold-accent bg-gold-bg/40 text-neutral-900 shadow-sm font-black'
                  : 'border-gray-200 text-neutral-800 hover:border-neutral-450 hover:bg-neutral-55'
              }`}
              aria-label={`Select storage size ${option}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StorageSelector;
