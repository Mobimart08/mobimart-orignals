import React from 'react';
import { Shield, Award, Sparkles } from 'lucide-react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

/* ==========================================================================
   WhyChoose Component
   - Renders the "Why Choose MobiMart" heading
   - Renders 3 grid cards side-by-side horizontally:
     1. Certified Devices (Shield icon)
     2. 12 Month Warranty (Award icon)
     3. Free Shipping (Sparkles/Tag icon)
   - Centered alignment within each card
   ========================================================================== */

export const WhyChoose = () => {
  const cards = [
    {
      icon: <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-amber-800" />,
      title: 'Certified Devices',
      desc: 'Fully certified, tested for minimal limit, and luxury spacing.',
    },
    {
      icon: <Award className="w-4 h-4 sm:w-6 sm:h-6 text-amber-800" />,
      title: '12 Month Warranty',
      desc: 'Industry-leading terms with minimal touch, and luxury spacing.',
    },
    {
      icon: <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-800" />,
      title: 'Free Shipping',
      desc: 'Fast and free shipping on all orders with minimal styling.',
    },
  ];

  return (
    <section className="w-full pb-8 bg-white">
      <Container>
        <SectionTitle title="Why Choose MobiMart" />

        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {cards.map((card, idx) => (
            <Card
              key={idx}
              variant="custom"
              className="bg-white border border-gray-150/70 p-3 sm:p-6 rounded-2xl flex flex-col items-center justify-start text-center shadow-[0_2px_16px_rgba(0,0,0,0.01)] hover:shadow-soft-ui transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gold-bg border border-[#EBDCD0]/50 flex items-center justify-center mb-2.5 sm:mb-4 shrink-0">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-[10px] sm:text-base font-extrabold text-neutral-950 leading-tight mb-1 sm:mb-2 select-none">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-[7px] sm:text-xs text-gray-500 font-semibold leading-normal sm:leading-relaxed">
                {card.desc}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChoose;
