import React, { useState } from 'react';

/* ==========================================================================
   ProductGallery Component
   - Displays the large active preview image
   - Renders matching slide dots indicator below the image
   - Renders the ThumbnailStrip below for interactive image toggles
   ========================================================================== */

export const ProductGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center text-xs text-gray-400 font-bold select-none">
        No images available
      </div>
    );
  }

  // Active preview image
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="w-full flex flex-col items-center select-none bg-white p-4 rounded-3xl border border-gray-150/40 shadow-soft-ui relative overflow-hidden">
      
      {/* 1. Large Image Preview Container */}
      <div className="w-full aspect-[4/3] flex items-center justify-center p-3 relative bg-[#ECEFF2]/20 rounded-2xl overflow-hidden transition-all duration-300">
        <img
          src={activeImage}
          alt={`Product view ${activeIndex + 1}`}
          className="h-full w-auto object-contain object-bottom transition-all duration-300 transform scale-100 filter drop-shadow-[-4px_6px_10px_rgba(0,0,0,0.06)]"
        />
      </div>

      {/* 2. Slide Dot Indicators */}
      <div className="flex items-center gap-1.5 mt-4 mb-5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-250 cursor-pointer ${
              idx === activeIndex
                ? 'bg-neutral-850 w-3'
                : 'bg-neutral-250 hover:bg-neutral-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 3. Thumbnail Carousel Strip */}
      <ThumbnailStrip 
        images={images} 
        activeIndex={activeIndex} 
        onSelect={setActiveIndex} 
      />

    </div>
  );
};

/* ==========================================================================
   ThumbnailStrip Subcomponent
   - Displays a horizontal list of clickable image thumbnails
   - Highlights the active thumbnail card
   ========================================================================== */

export const ThumbnailStrip = ({ images = [], activeIndex = 0, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-0.5">
      <div className="flex items-center gap-3.5 justify-start md:justify-center w-max mx-auto px-2 md:px-0 md:w-full">
        {images.map((image, idx) => {
          const isActive = idx === activeIndex;
          const isLastItem = idx === images.length - 1;
          const showBadge = isLastItem && images.length > 2;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect && onSelect(idx)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-2 flex items-center justify-center p-1.5 shrink-0 overflow-hidden relative transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-neutral-900 shadow-sm scale-102'
                  : 'border-gray-150 hover:border-neutral-450'
              }`}
              aria-label={`Select preview image ${idx + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail preview ${idx + 1}`}
                className="h-full w-auto object-contain object-bottom pointer-events-none select-none"
              />

              {/* +3 overlay badge mock for the last item (matching Slice 1 "+3" badge) */}
              {showBadge && (
                <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center text-white text-[10px] sm:text-xs font-black select-none pointer-events-none">
                  +3
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;
