import React from 'react';
import { Shield, Award, Sparkles } from 'lucide-react';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

/* ==========================================================================
   WhyChoose Component
   - Renders 3 feature cards
   - Cards open Why Choose Information Modal
   ========================================================================== */

export const WhyChoose = ({ onCardClick }) => {
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

        <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 select-none">
          {cards.map((card, idx) => (
            <div key={idx} onClick={onCardClick} className="cursor-pointer group">
              <Card
                variant="custom"
                className="bg-white border border-gray-150/70 p-3 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center justify-start text-center shadow-[0_2px_16px_rgba(0,0,0,0.01)] hover:shadow-soft-ui hover:border-gold-accent/40 transition-all duration-300 h-full"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gold-bg border border-[#EBDCD0]/50 flex items-center justify-center mb-2.5 sm:mb-4 shrink-0 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>

                <h3 className="text-[10px] sm:text-base font-extrabold text-neutral-950 leading-tight mb-1 sm:mb-2 group-hover:text-gold-accent transition-colors">
                  {card.title}
                </h3>

                <p className="text-[7px] sm:text-xs text-gray-500 font-semibold leading-normal sm:leading-relaxed">
                  {card.desc}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChoose;
