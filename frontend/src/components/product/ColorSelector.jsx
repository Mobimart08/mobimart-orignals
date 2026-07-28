import React from 'react';

/* ==========================================================================
   ColorSelector Component
   - Renders colored circles to toggle product variants
   - Displays current active color name label next to section header
   - Applies elegant double border ring to active circle
   ========================================================================== */

export const ColorSelector = ({ options = [], selected, onChange }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-3">
      {/* Header with active name label */}
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 flex items-center gap-1.5">
        <span>Color:</span>
        <span className="text-gray-500 font-semibold">{selected?.name || options[0]?.name}</span>
      </h3>

      {/* Color circles row */}
      <div className="flex items-center gap-3">
        {options.map((option) => {
          const isSelected = option.name === selected?.name;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onChange && onChange(option)}
              className={`w-7 h-7 rounded-full transition-all duration-200 cursor-pointer relative flex items-center justify-center border border-gray-250/20 hover:border-neutral-400 hover:shadow-sm active:opacity-90`}
              style={{ backgroundColor: option.value }}
              aria-label={`Select color ${option.name}`}
            >
              {/* Luxury double ring overlay for selected state */}
              {isSelected && (
                <span className="absolute inset-0 rounded-full border-2 border-white scale-90 ring-1.5 ring-neutral-900 pointer-events-none"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
