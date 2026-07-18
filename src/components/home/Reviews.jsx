import React from 'react';
import { Star, Quote, User } from 'lucide-react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

/* ==========================================================================
   Reviews Component
   - Renders the "Customer Reviews" heading
   - Card 1: Avatar (Left) -> Quote (Right)
   - Card 2: Rating Stars (Left) -> Quote (Center) -> Avatar (Right)
   - Enforces asymmetrical luxury layout with soft shadows
   ========================================================================== */

export const Reviews = () => {
  return (
    <section className="w-full pb-8 bg-white">
      <Container>
        <SectionTitle title="Customer Reviews" />

        <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Sarah Chen */}
          <Card
            variant="custom"
            className="bg-white border border-gray-100 shadow-soft-ui rounded-2xl p-4 sm:p-8 flex flex-row items-start gap-3 sm:gap-6 text-left"
          >
            {/* Left: Avatar representation (Peach Theme) */}
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-orange-100 border border-orange-200/50 flex items-center justify-center shrink-0 relative overflow-hidden">
              <User className="w-5 h-5 sm:w-8 sm:h-8 text-orange-400/80 absolute bottom-0" />
            </div>

            {/* Right: Quote Details */}
            <div className="flex-1 min-w-0 relative">
              {/* Quote Mark Icon */}
              <Quote className="w-4 h-4 sm:w-8 sm:h-8 text-gold-accent opacity-20 absolute -top-1 sm:-top-3 -left-1 pointer-events-none" />
              
              <div className="pl-4 sm:pl-8">
                <blockquote className="text-[9.5px] sm:text-base text-neutral-800 font-semibold leading-relaxed italic">
                  MobiMart has transformed my smartphone experience. The certified pre-owned iPhone I bought was practically new, and the warranty gave me confidence.
                </blockquote>
                <cite className="not-italic text-[8px] sm:text-xs text-gray-400 font-extrabold uppercase tracking-wider block mt-2 sm:mt-3">
                  Sarah Chen, <span className="text-gray-300 font-medium">verified buyer</span>
                </cite>
              </div>
            </div>
          </Card>

          {/* Card 2: Mark Johnson (Asymmetrical) */}
          <Card
            variant="custom"
            className="bg-white border border-gray-100 shadow-soft-ui rounded-2xl p-4 sm:p-8 flex flex-row items-center justify-between gap-3 sm:gap-6 text-left"
          >
            {/* Left: Rating Block */}
            <div className="flex flex-col items-center justify-center shrink-0 w-[22%] sm:w-[20%] text-center border-r border-gray-100 pr-2 sm:pr-4">
              <div className="flex gap-0.5 text-amber-500">
                <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-current" />
              </div>
              <span className="text-[6.5px] sm:text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
                Elegant ratings
              </span>
            </div>

            {/* Center: Quote Details */}
            <div className="flex-1 min-w-0 relative px-2 sm:px-4">
              <Quote className="w-4 h-4 sm:w-8 sm:h-8 text-gold-accent opacity-20 absolute -top-1 sm:-top-3 -left-1 pointer-events-none" />
              
              <div className="pl-4 sm:pl-8">
                <blockquote className="text-[9.5px] sm:text-base text-neutral-800 font-semibold leading-relaxed italic">
                  Found my dream Pixel at a fraction of the cost. The inspection process is incredible.
                </blockquote>
                <cite className="not-italic text-[8px] sm:text-xs text-gray-400 font-extrabold uppercase tracking-wider block mt-2 sm:mt-3">
                  Mark Johnson, <span className="text-gray-300 font-medium">tech enthusiast</span>
                </cite>
              </div>
            </div>

            {/* Right: Avatar representation (Blue Theme) */}
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-blue-100 border border-blue-200/50 flex items-center justify-center shrink-0 relative overflow-hidden">
              <User className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400/80 absolute bottom-0" />
            </div>
          </Card>

        </div>
      </Container>
    </section>
  );
};

export default Reviews;
