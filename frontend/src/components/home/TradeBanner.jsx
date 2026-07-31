import React from 'react';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';
import tradeInPhone from '../../assets/trade_in_phone.webp';

/* ==========================================================================
   TradeBanner Component
   - Renders Trade-In banner card
   - Discover Now CTA opens Coming Soon Bottom Sheet
   ========================================================================== */

export const TradeBanner = ({ onDiscoverClick }) => {
  return (
    <section className="w-full pb-8 bg-white">
      <Container>
        <Card
          variant="custom"
          className="bg-[#0B0B0C] border border-neutral-900/60 p-6 sm:p-12 relative overflow-hidden rounded-[24px] sm:rounded-[32px] h-[200px] sm:h-[280px]"
        >
          {/* Subtle Concentric Gold Rings */}
          <div className="absolute top-[10%] right-[-10%] w-[160px] sm:w-[260px] h-[160px] sm:h-[260px] rounded-full border border-amber-600/10 pointer-events-none z-0" aria-hidden="true" />
          <div className="absolute top-[-10%] right-[-15%] w-[200px] sm:w-[320px] h-[200px] sm:h-[320px] rounded-full border border-amber-500/5 pointer-events-none z-0" aria-hidden="true" />

          <div className="grid grid-cols-12 gap-4 items-center h-full relative z-10">
            {/* Left: Text & CTA Button */}
            <div className="col-span-7 flex flex-col items-start text-left h-full justify-center pl-2 md:pl-6">
              <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                Trade-In
              </h3>
              
              <p className="text-[9px] sm:text-xs md:text-sm text-neutral-400 font-semibold leading-relaxed mb-3 sm:mb-6 max-w-[220px] sm:max-w-md">
                Unlock your old phone's value. Trade in your current device for credit toward your next upgrade.
              </p>

              <Button 
                type="button"
                onClick={onDiscoverClick}
                variant="outlineLuxe" 
                size="sm" 
                className="border-amber-600/60 text-[#C5A880] hover:bg-gold-bg/10 hover:border-amber-500/80 cursor-pointer !px-4 !py-1.5 md:!px-6 md:!py-2.5 !text-[8px] sm:!text-xs"
              >
                Discover Now
              </Button>
            </div>

            {/* Right: Mockup */}
            <div className="col-span-5 h-full flex items-center justify-end relative">
              <div className="absolute top-[20%] right-0 w-[120px] sm:w-[220px] h-[120px] sm:h-[220px] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.18)_0%,transparent_70%)] pointer-events-none z-0" />

              <div className="w-[130px] sm:w-[220px] aspect-[1/1] rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden z-10 mr-1 border border-neutral-900 bg-neutral-950 transition-opacity duration-300 opacity-95 group-hover:opacity-100">
                <img 
                  src={tradeInPhone}
                  alt="Trade-In iPhone"
                  className="w-full h-full object-cover select-none pointer-events-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default TradeBanner;
