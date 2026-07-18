import React from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import heroBgBanner from '../../assets/hero_bg_banner.png';

/* ==========================================================================
   Hero Section
   - Renders the primary headline, description, and action CTAs
   - Uses the official high-resolution design image as the container background
   - The embedded phone mockup is positioned on the right of the background banner
   ========================================================================== */

export const Hero = () => {
  return (
    <section className="w-full pb-6 pt-2">
      <Container>
        <div 
          className="border border-gray-150/40 shadow-soft-ui rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-14 relative overflow-hidden bg-cover bg-no-repeat bg-[center_right] sm:bg-[center_right] h-[210px] sm:h-[320px] md:h-[440px] flex items-center transition-all duration-300"
          style={{ backgroundImage: `url(${heroBgBanner})` }}
        >
          {/* Content Block (Occupies left columns so background phone on the right is fully visible) */}
          <div className="grid grid-cols-12 gap-4 items-center relative z-10 w-full">
            <div className="col-span-8 sm:col-span-7 md:col-span-6 flex flex-col items-start text-left">
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-neutral-950 leading-[1.12] sm:leading-[1.1] mb-2 sm:mb-5 select-none">
                Technology <br />
                <span className="text-neutral-950">Worth Owning.</span>
              </h1>
              
              <p className="text-[10px] sm:text-xs md:text-base text-gray-500 font-medium max-w-[180px] sm:max-w-sm mb-3 sm:mb-8 leading-relaxed select-none">
                Perfect typographic hierarchy with minimal body text and cornerations.
              </p>

              <div className="flex flex-row items-center gap-1.5 sm:gap-3.5 w-full">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="!px-3.5 !py-1.5 sm:!px-6 sm:!py-3.5 text-[8px] sm:text-xs cursor-pointer hover:brightness-90 transition-all"
                >
                  Shop Now
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="!px-3.5 !py-1.5 sm:!px-6 sm:!py-3.5 text-[8px] sm:text-xs cursor-pointer hover:bg-neutral-100 transition-all"
                >
                  Sell Your
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Hero;
