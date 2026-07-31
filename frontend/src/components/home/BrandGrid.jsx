import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import brandAppleIphone from '../../assets/brand_apple_iphone.webp';
import brandSamsungPhone from '../../assets/brand_samsung_phone.webp';
import brandGooglePhone from '../../assets/brand_google_phone.webp';
import brandNothingPhone from '../../assets/brand_nothing_phone.webp';
import brandOneplusPhone from '../../assets/brand_oneplus_phone.webp';

/* ==========================================================================
   BrandGrid Component
   - Renders Featured Brands
   - Cards navigate to /store?brand={brand}
   ========================================================================== */

export const BrandGrid = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    navigate(`/store?brand=${encodeURIComponent(brandName)}`);
  };

  const brandRow1 = [
    {
      name: 'Apple',
      subtitle: 'Luxury White',
      bgClass: 'bg-[#F4F4F6]',
      textClass: 'text-neutral-900',
      logo: (
        <svg viewBox="0 0 384 512" className="w-5 h-5 sm:w-8 sm:h-8 fill-current text-neutral-950 opacity-95 select-none" aria-label="Apple logo">
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 24 184.8 8 273.5q-9 53.3 11.7 109.2c23.2 61 52.2 95 86.2 93.3 32.5-1.9 45.8-22.4 81.8-22.4 35.2 0 47.1 22.4 83.2 21.9 38.3-.3 65.6-36.2 87.2-76 25-45 31.7-89.8 32-92.4-1.7-1.1-42.6-17.7-42.4-65.2zM224 71.3c21.5-24.7 34.6-58.4 31.2-91.3-26.8 2.2-61.9 20.4-82.7 45.1-18.7 21.9-33.1 56-29 88.6 29.7 1.9 61.1-18.4 80.5-42.4z"/>
        </svg>
      ),
      image: brandAppleIphone,
      imageClass: 'scale-90 md:scale-100 origin-bottom-right',
    },
    {
      name: 'Samsung',
      subtitle: 'Matte Black',
      bgClass: 'bg-[#0A0A0A]',
      textClass: 'text-white',
      logo: (
        <span className="text-xl sm:text-4xl font-extrabold italic tracking-widest select-none text-white font-sans leading-none">
          S
        </span>
      ),
      image: brandSamsungPhone,
    },
    {
      name: 'Google',
      subtitle: 'Miii stone grey',
      bgClass: 'bg-[#C5C9D0]',
      textClass: 'text-neutral-900',
      logo: (
        <span className="text-xl sm:text-4xl font-black select-none text-neutral-800/30 leading-none">
          G
        </span>
      ),
      image: brandGooglePhone,
    },
  ];

  const brandRow2 = [
    {
      name: 'Nothing',
      subtitle: 'Industrial Phone',
      bgClass: 'bg-[#ECF0F4]',
      textClass: 'text-neutral-900',
      logo: (
        <svg viewBox="0 0 40 40" className="w-5 h-5 sm:w-9 sm:h-9 text-neutral-900 fill-current opacity-85 select-none" aria-label="Nothing dot N">
          <circle cx="8" cy="8" r="2.2" />
          <circle cx="8" cy="16" r="2.2" />
          <circle cx="8" cy="24" r="2.2" />
          <circle cx="8" cy="32" r="2.2" />
          <circle cx="16" cy="16" r="2.2" />
          <circle cx="24" cy="24" r="2.2" />
          <circle cx="32" cy="8" r="2.2" />
          <circle cx="32" cy="16" r="2.2" />
          <circle cx="32" cy="24" r="2.2" />
          <circle cx="32" cy="32" r="2.2" />
        </svg>
      ),
      image: brandNothingPhone,
    },
    {
      name: 'OnePlus',
      subtitle: 'Bold Accont',
      bgClass: 'bg-[#A61018]',
      textClass: 'text-white',
      logo: (
        <svg viewBox="0 0 100 100" className="w-5 h-5 sm:w-9 sm:h-9 fill-current text-white opacity-95 select-none" aria-label="OnePlus logo">
          <rect x="8" y="28" width="58" height="58" fill="none" stroke="currentColor" strokeWidth="8" rx="2" />
          <path d="M34,40 L28,45 V50 H32 V76 H26 V81 H46 V76 H40 V40 H34 Z" fill="currentColor" />
          <path d="M74,22 H90 M82,14 V30" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="square" />
        </svg>
      ),
      image: brandOneplusPhone,
    },
  ];

  const renderCard = (brand) => (
    <div key={brand.name} onClick={() => handleBrandClick(brand.name)} className="w-full cursor-pointer">
      <Card
        variant="custom"
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 flex flex-col justify-between aspect-[4/5] w-full border-none shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-premium hover:-translate-y-1 group ${brand.bgClass} ${brand.textClass}`}
      >
        {/* Top Details */}
        <div className="text-left z-10">
          <h3 className="font-extrabold text-sm sm:text-xl md:text-2xl tracking-tight leading-tight">
            {brand.name}
          </h3>
          <p className="text-[8px] sm:text-xs md:text-sm opacity-50 font-semibold tracking-wide mt-0.5">
            {brand.subtitle}
          </p>
        </div>

        {/* Bottom Left: Brand Icon Symbol */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center justify-center">
          {brand.logo}
        </div>

        {/* Bottom Right: Phone Image */}
        <div className="absolute bottom-0 right-0 w-[60%] sm:w-[62%] h-[78%] sm:h-[82%] z-20 flex items-end justify-end overflow-hidden pointer-events-none">
          {brand.image && (
            <img 
              src={brand.image} 
              className={`w-full h-full object-contain object-bottom select-none pointer-events-none transition-all duration-300 filter drop-shadow-[-4px_4px_10px_rgba(0,0,0,0.08)] ${brand.imageClass || ''}`}
            />
          )}
        </div>
      </Card>
    </div>
  );

  return (
    <section className="w-full pb-8">
      <Container>
        <SectionTitle title="Featured Brands" />

        {/* Mobile / Tablet Layout (Original 3/2 split) */}
        <div className="flex lg:hidden flex-col gap-3.5 sm:gap-6">
          <div className="grid grid-cols-3 gap-3.5 sm:gap-6">
            {brandRow1.map(renderCard)}
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 w-2/3 mx-auto">
            {brandRow2.map(renderCard)}
          </div>
        </div>

        {/* Desktop Layout (Single Row of 5, naturally scales them down) */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6 w-full max-w-7xl mx-auto">
          {[...brandRow1, ...brandRow2].map(renderCard)}
        </div>
      </Container>
    </section>
  );
};

export default BrandGrid;
