import React from 'react';
import { LayoutGrid, ChevronDown } from 'lucide-react';

/* ==========================================================================
   CategoryTabs Component
   - Renders a horizontal, scrollable pill bar of categories shaped as brand logo circles
   - Dynamically highlights active circles (neutral dark bg, white logo contents)
   - Left: All dashboard grid icon
   - Center: Apple, Samsung, Google, Nothing, OnePlus brand logo marks
   - Right: "More" dropdown tab
   ========================================================================== */

export const CategoryTabs = ({ activeCategory = 'All', onCategorySelect }) => {
  const tabs = [
    { 
      id: 'All', 
      label: 'All', 
      icon: (isActive) => <LayoutGrid size={18} className={isActive ? 'text-white' : 'text-neutral-800'} strokeWidth={2.2} /> 
    },
    { 
      id: 'Apple', 
      label: 'Apple', 
      icon: (isActive) => (
        <svg viewBox="0 0 170 170" className={`w-4 h-4 fill-current ${isActive ? 'text-white' : 'text-neutral-950'}`}>
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.88-2.38-6.67-6.89-11.37-13.56-8.72-12.5-15.11-26.63-19.17-42.36-4.07-15.72-6.11-30.82-6.11-45.29 0-15.12 3.63-27.42 10.89-36.93 7.26-9.5 16.32-14.35 27.17-14.54 6.27-.12 12.87 1.77 19.8 5.67 6.93 3.9 11.28 5.66 13.06 5.28 2.05-.51 6.53-2.46 13.43-5.83 6.9-3.37 13.08-4.88 18.52-4.55 14.88.75 26.23 6.29 34.07 16.63-11.51 6.99-17.16 16.33-16.96 28.02.26 9.4 3.97 17.26 11.13 23.57 7.16 6.32 15.66 9.77 25.5 10.35-2.12 6.37-4.81 12.55-8.08 18.53zM119.22 30.13c0-7.83 2.8-15.13 8.41-21.11 5.61-5.98 12.44-9.35 20.27-10.02.13 1.25.19 2.19.19 2.82 0 7.64-2.85 14.75-8.56 20.73-5.71 5.98-12.63 9.4-20.31 9.26-.06-.88-.06-1.5-.06-1.72z" />
        </svg>
      )
    },
    { 
      id: 'Samsung', 
      label: 'Samsung', 
      icon: (isActive) => (
        <span className={`text-[7px] sm:text-[8px] font-black tracking-widest leading-none select-none font-sans ${isActive ? 'text-white' : 'text-blue-900'} uppercase`}>
          Samsung
        </span>
      )
    },
    { 
      id: 'Google', 
      label: 'Google', 
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    },
    { 
      id: 'Nothing', 
      label: 'Nothing', 
      icon: (isActive) => (
        <span className={`font-mono text-sm font-bold tracking-tight select-none leading-none ${isActive ? 'text-white' : 'text-neutral-900'}`}>
          N
        </span>
      )
    },
    { 
      id: 'OnePlus', 
      label: 'OnePlus', 
      icon: (isActive) => (
        <span className={`text-[11px] font-black select-none font-sans leading-none ${isActive ? 'text-white' : 'text-[#A81C24]'}`}>
          1+
        </span>
      )
    },
    { 
      id: 'More v', 
      label: 'More', 
      icon: (isActive) => <ChevronDown size={16} className={isActive ? 'text-white' : 'text-neutral-600'} strokeWidth={2.4} /> 
    }
  ];

  return (
    <div className="w-full bg-[#FAF9F6] relative z-10 py-3 select-none">
      <div className="max-w-5xl mx-auto px-4">
        {/* Horizontal scroll container with scrollbar hidden */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap no-scrollbar scroll-smooth py-1 px-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeCategory;
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (onCategorySelect) {
                    onCategorySelect(tab.id);
                  }
                }}
                className="flex flex-col items-center shrink-0 cursor-pointer focus:outline-none group"
                aria-label={`Select category ${tab.label}`}
              >
                {/* Circle Container holding logo icon */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border shadow-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-950 border-neutral-950 text-white scale-102 shadow-md'
                    : 'bg-white text-neutral-800 border-gray-200/60 hover:bg-neutral-50 shadow-[0_2px_6px_rgba(0,0,0,0.015)] hover:border-neutral-350'
                }`}>
                  {tab.icon(isActive)}
                </div>

                {/* Subtext Label */}
                <span className={`text-[9.5px] sm:text-[10px] font-bold mt-1.5 transition-colors tracking-tight ${
                  isActive ? 'text-neutral-950 font-black' : 'text-gray-500 group-hover:text-neutral-800'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
