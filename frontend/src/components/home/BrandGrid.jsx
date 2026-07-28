import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import brandAppleIphone from '../../assets/brand_apple_iphone.png';
import brandSamsungPhone from '../../assets/brand_samsung_phone.png';
import brandGooglePhone from '../../assets/brand_google_phone.png';
import brandNothingPhone from '../../assets/brand_nothing_phone.png';
import brandOneplusPhone from '../../assets/brand_oneplus_phone.png';

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
        <svg viewBox="0 0 170 170" className="w-5 h-5 sm:w-8 sm:h-8 fill-current text-neutral-950 opacity-95 select-none" aria-label="Apple logo">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.88-2.38-6.67-6.89-11.37-13.56-8.72-12.5-15.11-26.63-19.17-42.36-4.07-15.72-6.11-30.82-6.11-45.29 0-15.12 3.63-27.42 10.89-36.93 7.26-9.5 16.32-14.35 27.17-14.54 6.27-.12 12.87 1.77 19.8 5.67 6.93 3.9 11.28 5.66 13.06 5.28 2.05-.51 6.53-2.46 13.43-5.83 6.9-3.37 13.08-4.88 18.52-4.55 14.88.75 26.23 6.29 34.07 16.63-11.51 6.99-17.16 16.33-16.96 28.02.26 9.4 3.97 17.26 11.13 23.57 7.16 6.32 15.66 9.77 25.5 10.35-2.12 6.37-4.81 12.55-8.08 18.53zM119.22 30.13c0-7.83 2.8-15.13 8.41-21.11 5.61-5.98 12.44-9.35 20.27-10.02.13 1.25.19 2.19.19 2.82 0 7.64-2.85 14.75-8.56 20.73-5.71 5.98-12.63 9.4-20.31 9.26-.06-.88-.06-1.5-.06-1.72z" />
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
