import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import heroBgBanner from '../../assets/hero_bg_banner.png';

/* ==========================================================================
   Hero Section
   - Renders the primary headline, description, and action CTAs
   - Shop Now -> Navigates to /store
   - Sell Your Device -> Triggers Coming Soon sheet
   ========================================================================== */

export const Hero = ({ onSellClick }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full pb-6 pt-2">
      <Container>
        <div 
          className="border border-gray-150/40 shadow-soft-ui rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-14 relative overflow-hidden bg-cover bg-no-repeat bg-[center_right] sm:bg-[center_right] h-[210px] sm:h-[320px] md:h-[440px] flex items-center transition-all duration-300"
          style={{ backgroundImage: `url(${heroBgBanner})` }}
        >
          {/* Content Block */}
          <div className="grid grid-cols-12 gap-4 items-center relative z-10 w-full">
            <div className="col-span-8 sm:col-span-7 md:col-span-6 flex flex-col items-start text-left justify-center">
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.12] sm:leading-[1.1] mb-2 sm:mb-4 select-none">
                Technology <br />
                <span className="text-neutral-950">Worth Owning.</span>
              </h1>
              
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 font-medium max-w-[180px] sm:max-w-xs md:max-w-sm mb-3 sm:mb-6 leading-relaxed select-none">
                Certified pre-owned and new premium smartphones backed by 12 months warranty.
              </p>

              <div className="flex flex-row items-center gap-1.5 sm:gap-3.5 w-full">
                <Button 
                  type="button"
                  onClick={() => navigate('/store')}
                  variant="primary" 
                  size="sm" 
                  className="!px-3.5 !py-1.5 sm:!px-6 sm:!py-3.5 text-[8px] sm:text-xs cursor-pointer hover:brightness-90 transition-all"
                >
                  Shop Now
                </Button>
                <Button 
                  type="button"
                  onClick={onSellClick}
                  variant="secondary" 
                  size="sm" 
                  className="!px-3.5 !py-1.5 sm:!px-6 sm:!py-3.5 text-[8px] sm:text-xs cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                  Sell Your Device
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
