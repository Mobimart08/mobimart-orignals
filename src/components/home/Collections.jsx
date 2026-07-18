import React from 'react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import collectionIphone from '../../assets/collection_iphone.png';
import collectionAndroid from '../../assets/collection_android.png';
import collectionPreowned from '../../assets/collection_preowned.png';
import collectionBudget from '../../assets/collection_budget.png';

/* ==========================================================================
   Collections Component
   - Renders the "Premium Collections" heading inside a solid white section
   - Card 1: Latest iPhones (Greyish bg, black Learn Now CTA, iPhone pair)
   - Card 2: Flagship Android (Dull black, Gold title, Gold CTA, golden glow, S24 mock)
   - Card 3: Certified Pre-Owned (Greyish bg, Gold CTA, stage light pedestal, iPhone trio)
   - Card 4: Budget Champions (Dull black, Gold CTA, gold concentric rings, gold rim podium)
   ========================================================================== */

export const Collections = () => {
  return (
    <section className="w-full py-10 md:py-16 bg-white">
      <Container>
        <SectionTitle title="Premium Collections" />

        <div className="flex flex-col gap-5 sm:gap-6">
          
          {/* 1. Latest iPhones Banner */}
          <Card 
            variant="custom" 
            className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#ECEFF2] border border-gray-200/10 group h-[220px] sm:h-[300px]"
          >
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-[55%] z-20">
              <h3 className="text-xl sm:text-3xl font-extrabold text-neutral-950 leading-tight mb-2 tracking-tight">
                Latest iPhones
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-semibold leading-relaxed mb-4 sm:mb-6 max-w-[200px] sm:max-w-xs">
                Adopt the certified iPhone design tool for elegant composition.
              </p>
              <Button variant="primary" size="sm" className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:brightness-90 transition-all">
                Learn Now
              </Button>
            </div>

            {/* Right: Full-bleed campaign photograph */}
            <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[50%] h-full z-10 overflow-hidden pointer-events-none">
              <img 
                src={collectionIphone} 
                alt="Latest iPhones" 
                className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100"
              />
            </div>
          </Card>

          {/* 2. Flagship Android Banner */}
          <Card 
            variant="custom" 
            className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#0B0B0C] border border-neutral-900/80 group h-[220px] sm:h-[300px]"
          >
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-[55%] z-20">
              <h3 className="text-xl sm:text-3xl font-extrabold text-[#C5A880] leading-tight mb-2 tracking-tight">
                Flagship <br className="sm:hidden" /> Android
              </h3>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold leading-relaxed mb-4 sm:mb-6 max-w-[200px] sm:max-w-xs">
                Find classic android devices with detailed, high level features.
              </p>
              <Button variant="secondary" size="sm" className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#F4EFEA]/90 transition-all">
                Download!
              </Button>
            </div>

            {/* Right: Full-bleed campaign photograph */}
            <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[50%] h-full z-10 overflow-hidden pointer-events-none p-4 sm:p-6 flex items-center justify-center">
              <img 
                src={collectionAndroid} 
                alt="Flagship Android" 
                className="max-w-full max-h-full object-contain select-none pointer-events-none transition-opacity duration-300 scale-[2.0] opacity-95 group-hover:opacity-100"
              />
            </div>
          </Card>

          {/* 3. Certified Pre-Owned Banner */}
          <Card 
            variant="custom" 
            className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#ECEFF2] border border-gray-200/10 group h-[220px] sm:h-[300px]"
          >
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-[55%] z-20">
              <h3 className="text-xl sm:text-3xl font-extrabold text-neutral-950 leading-tight mb-2 tracking-tight">
                Certified Pre-Owned
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-semibold leading-relaxed mb-4 sm:mb-6 max-w-[200px] sm:max-w-xs">
                Minimum wear-and-tear with certified standard product lighting.
              </p>
              <Button variant="secondary" size="sm" className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#FAF9F6]/90 transition-all">
                Read More
              </Button>
            </div>

            {/* Right: Full-bleed campaign photograph */}
            <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[50%] h-full z-10 overflow-hidden pointer-events-none">
              <img 
                src={collectionPreowned} 
                alt="Certified Pre-Owned" 
                className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100"
              />
            </div>
          </Card>

          {/* 4. Budget Champions Banner */}
          <Card 
            variant="custom" 
            className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#0B0B0C] border border-neutral-900/80 group h-[220px] sm:h-[300px]"
          >
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-[55%] z-20">
              <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                Budget Champions
              </h3>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold leading-relaxed mb-4 sm:mb-6 max-w-[200px] sm:max-w-xs">
                Find the savings you need with durable, premium products.
              </p>
              <Button variant="secondary" size="sm" className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#FAF9F6]/90 transition-all">
                Learn More
              </Button>
            </div>

            {/* Right: Full-bleed campaign photograph */}
            <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[50%] h-full z-10 overflow-hidden pointer-events-none">
              <img 
                src={collectionBudget} 
                alt="Budget Champions" 
                className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100"
              />
            </div>
          </Card>

        </div>
      </Container>
    </section>
  );
};

export default Collections;
