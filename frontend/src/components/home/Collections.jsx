import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import collectionIphone from '../../assets/collection_iphone.webp';
import collectionAndroid from '../../assets/collection_android.webp';
import collectionPreowned from '../../assets/collection_preowned.webp';
import collectionBudget from '../../assets/collection_budget.webp';

/* ==========================================================================
   Collections Component
   - Card 1: Latest iPhones -> /store?brand=Apple
   - Card 2: Flagship Android -> /store?category=Android
   - Card 3: Certified Pre-Owned -> /store?category=Refurbished
   - Card 4: Budget Champions -> /store?category=Budget
   ========================================================================== */

export const Collections = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-10 md:py-16 bg-white">
      <Container>
        <SectionTitle title="Premium Collections" />

        <div className="flex flex-col gap-5 sm:gap-6">
          
          {/* 1. Latest iPhones Banner */}
          <div onClick={() => navigate('/store?brand=Apple')} className="cursor-pointer">
            <Card 
              variant="custom" 
              className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#ECEFF2] border border-gray-200/10 group h-[220px] sm:h-[300px]"
            >
              {/* Left Content */}
              <div className="flex flex-col items-start text-left max-w-[55%] z-20 justify-center">
                <h3 className="text-xl sm:text-3xl font-extrabold text-neutral-950 leading-tight mb-1.5 md:mb-2 tracking-tight">
                  Latest iPhones
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold leading-relaxed mb-4 md:mb-5 max-w-[200px] sm:max-w-xs">
                  Adopt the certified iPhone design tool for elegant composition.
                </p>
                <Button 
                  type="button"
                  variant="primary" 
                  size="sm" 
                  className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:brightness-90 transition-all"
                >
                  Learn Now
                </Button>
              </div>

              {/* Right: Image */}
              <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[45%] h-full z-10 overflow-hidden pointer-events-none md:p-4 flex items-center justify-end">
                <img 
                  src={collectionIphone} 
                  alt="Latest iPhones" 
                  className="w-full h-full object-cover md:object-contain md:object-right select-none pointer-events-none transition-all duration-300 opacity-95 scale-80 md:scale-100 group-hover:opacity-100 origin-right"
                />
              </div>
            </Card>
          </div>

          {/* 2. Flagship Android Banner */}
          <div onClick={() => navigate('/store?category=Android')} className="cursor-pointer">
            <Card 
              variant="custom" 
              className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#0B0B0C] border border-neutral-900/80 group h-[220px] sm:h-[300px]"
            >
              {/* Left Content */}
              <div className="flex flex-col items-start text-left max-w-[55%] z-20 justify-center">
                <h3 className="text-xl sm:text-3xl font-extrabold text-[#C5A880] leading-tight mb-1.5 md:mb-2 tracking-tight">
                  Flagship <br className="sm:hidden" /> Android
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold leading-relaxed mb-4 md:mb-5 max-w-[200px] sm:max-w-xs">
                  Find classic android devices with detailed, high level features.
                </p>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm" 
                  className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#F4EFEA]/90 transition-all"
                >
                  Explore Now
                </Button>
              </div>

              {/* Right: Image */}
              <div className="absolute top-0 bottom-0 right-0 w-[55%] md:w-[45%] h-full z-10 pointer-events-none p-2 sm:p-6 md:p-4 flex items-center justify-end">
                <img 
                  src={collectionAndroid} 
                  alt="Flagship Android" 
                  className="w-full h-full object-contain object-right md:object-right select-none pointer-events-none transition-all duration-300 scale-[1.3] md:scale-100 translate-x-7 md:translate-x-0 opacity-95 group-hover:opacity-100 origin-right"
                />
              </div>
            </Card>
          </div>

          {/* 3. Certified Pre-Owned Banner */}
          <div onClick={() => navigate('/store?category=Refurbished')} className="cursor-pointer">
            <Card 
              variant="custom" 
              className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#ECEFF2] border border-gray-200/10 group h-[220px] sm:h-[300px]"
            >
              {/* Left Content */}
              <div className="flex flex-col items-start text-left max-w-[55%] z-20 justify-center">
                <h3 className="text-xl sm:text-3xl font-extrabold text-neutral-950 leading-tight mb-1.5 md:mb-2 tracking-tight">
                  Certified Pre-Owned
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold leading-relaxed mb-4 md:mb-5 max-w-[200px] sm:max-w-xs">
                  Minimum wear-and-tear with certified standard product lighting.
                </p>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm" 
                  className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#FAF9F6]/90 transition-all"
                >
                  Read More
                </Button>
              </div>

              {/* Right: Image */}
              <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[45%] h-full z-10 overflow-hidden pointer-events-none md:p-4 flex items-center justify-end">
                <img 
                  src={collectionPreowned} 
                  alt="Certified Pre-Owned" 
                  className="w-full h-full object-cover md:object-contain md:object-right select-none pointer-events-none transition-all duration-300 opacity-95 scale-80 md:scale-100 group-hover:opacity-100 origin-right"
                />
              </div>
            </Card>
          </div>

          {/* 4. Budget Champions Banner */}
          <div onClick={() => navigate('/store?category=Budget')} className="cursor-pointer">
            <Card 
              variant="custom" 
              className="flex flex-row items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#0B0B0C] border border-neutral-900/80 group h-[220px] sm:h-[300px]"
            >
              {/* Left Content */}
              <div className="flex flex-col items-start text-left max-w-[55%] z-20 justify-center">
                <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5 md:mb-2 tracking-tight">
                  Budget Champions
                </h3>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold leading-relaxed mb-4 md:mb-5 max-w-[200px] sm:max-w-xs">
                  Find the savings you need with durable, premium products.
                </p>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm" 
                  className="cursor-pointer !px-5 !py-2 !text-[9px] sm:!text-xs hover:bg-[#FAF9F6]/90 transition-all"
                >
                  Learn More
                </Button>
              </div>

              {/* Right: Image */}
              <div className="absolute top-0 bottom-0 right-0 w-[48%] md:w-[45%] h-full z-10 overflow-hidden pointer-events-none md:p-4 flex items-center justify-end">
                <img 
                  src={collectionBudget} 
                  alt="Budget Champions" 
                  className="w-full h-full object-cover md:object-contain md:object-right select-none pointer-events-none transition-all duration-300 opacity-95 group-hover:opacity-100 origin-right"
                />
              </div>
            </Card>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Collections;
