import React, { useState, useEffect } from 'react';
import { brandService } from '../../api/services';

/* ==========================================================================
   BrandTabs Component
   - Renders a horizontal, scrollable pill bar of brands shaped as circular buttons
   - Replaces CategoryTabs
   ========================================================================== */

const BRAND_DOMAINS = {
  'apple': 'apple.com',
  'samsung': 'samsung.com',
  'google pixel': 'store.google.com',
  'google': 'google.com',
  'oneplus': 'oneplus.com',
  'nothing': 'nothing.tech',
  'cmf by nothing': 'cmf.tech',
  'xiaomi': 'mi.com',
  'redmi': 'mi.com',
  'poco': 'po.co',
  'realme': 'realme.com',
  'vivo': 'vivo.com',
  'iqoo': 'iqoo.com',
  'oppo': 'oppo.com',
  'motorola': 'motorola.com',
  'infinix': 'infinixmobility.com',
  'tecno': 'tecno-mobile.com',
  'lava': 'lavamobiles.com',
  'lenovo': 'lenovo.com',
  'asus': 'asus.com',
  'honor': 'hihonor.com',
  'nokia': 'nokia.com',
  'sony': 'sony.com'
};

export const BrandTabs = ({ activeBrand = 'All', onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const scrollRef = React.useRef(null);

  // Drag-to-scroll state
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);

  useEffect(() => {
    brandService.getAll().then(res => {
      setBrands([{ name: 'All', _id: 'All' }, ...(res.data.data || [])]);
    }).catch(err => console.error(err));
  }, []);

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Check if we are scrolling vertically on the mouse (deltaY)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const isAtLeftEdge = el.scrollLeft <= 0;
      const isAtRightEdge = el.scrollLeft >= el.scrollWidth - el.clientWidth;
      
      // If scrolling left while at the left edge, or right while at the right edge,
      // allow default vertical scroll of the page.
      if ((e.deltaY < 0 && isAtLeftEdge) || (e.deltaY > 0 && isAtRightEdge)) {
        return; // Allow page to scroll vertically
      }

      // Otherwise, intercept the vertical scroll and convert it to horizontal
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      // Must attach non-passive listener to be able to preventDefault
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    // Add a class to indicate grabbing, optional
    scrollRef.current.classList.add('cursor-grabbing');
    scrollRef.current.classList.remove('cursor-grab');
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove('cursor-grabbing');
      scrollRef.current.classList.add('cursor-grab');
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.classList.remove('cursor-grabbing');
      scrollRef.current.classList.add('cursor-grab');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Map brand names to official logos
  const getIconForBrand = (name, isActive) => {
    if (name === 'All') return <span className={`text-xs font-bold select-none ${isActive ? 'text-white' : 'text-neutral-900'}`}>All</span>;
    
    const domain = BRAND_DOMAINS[name.toLowerCase()] || `${name.toLowerCase().replace(/\s+/g, '')}.com`;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center p-2.5 sm:p-3">
        <img 
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
          alt={name} 
          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300"
          onError={(e) => { 
            e.target.style.display = 'none'; 
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
        <div className="hidden absolute inset-0 items-center justify-center" style={{ display: 'none' }}>
          <span className={`text-[10px] sm:text-xs font-bold select-none ${isActive ? 'text-white' : 'text-neutral-900'}`}>
            {name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  const tabsToRender = brands.map(brand => ({
    id: brand._id || brand.id, // use _id for API matching
    label: brand.name,
    icon: (isActive) => getIconForBrand(brand.name, isActive)
  }));

  return (
    <div className="w-full relative z-10 py-3 lg:py-5 select-none lg:mb-2 border-b border-gray-150/40 lg:border-none">
      {/* Horizontal scroll container with scrollbar hidden, mouse wheel enabled, drag enabled */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex items-center gap-4 lg:gap-6 overflow-x-auto whitespace-nowrap no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing select-none"
      >
        {tabsToRender.map((tab) => {
          const isActive = tab.id.toLowerCase() === activeBrand.toLowerCase();
          
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (onBrandSelect) {
                  onBrandSelect(tab.id);
                }
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer focus:outline-none group"
              aria-label={`Select brand ${tab.label}`}
            >
              {/* Circle Container holding logo icon */}
              <div className={`w-14 h-14 lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center border transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'bg-neutral-950 border-white text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] ring-2 ring-neutral-950 ring-offset-1'
                  : 'bg-white text-neutral-800 border-gray-200/60 hover:bg-neutral-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-350 hover:-translate-y-1'
              }`}>
                {tab.icon(isActive)}
              </div>

              {/* Subtext Label */}
              <span className={`text-[9.5px] sm:text-[11px] font-bold mt-2 transition-colors tracking-tight ${
                isActive ? 'text-neutral-950 font-black' : 'text-gray-500 group-hover:text-neutral-800'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BrandTabs;
