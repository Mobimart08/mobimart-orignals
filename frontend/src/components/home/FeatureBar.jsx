import React from 'react';
import { Award, ShieldCheck, Truck } from 'lucide-react';
import Container from '../ui/Container';
import Divider from '../ui/Divider';

/* ==========================================================================
   FeatureBar Component
   - Renders floating trust bar with key certifications
   - Certified Devices -> Certification Info Modal
   - 12 Month Warranty -> Warranty Info Modal
   - Free Shipping -> Shipping Policy Modal
   ========================================================================== */

export const FeatureBar = ({ onCertifiedClick, onWarrantyClick, onShippingClick }) => {
  const features = [
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-800" />,
      title: 'Certified Devices',
      subtext: 'Certified devices',
      onClick: onCertifiedClick,
    },
    {
      icon: <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-800" />,
      title: '12 Month Warranty',
      subtext: 'Superb warranty',
      onClick: onWarrantyClick,
    },
    {
      icon: <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-800" />,
      title: 'Free Shipping',
      subtext: 'Free shipping',
      onClick: onShippingClick,
    },
  ];

  return (
    <section className="w-full pb-6">
      <Container>
        <div className="bg-white border border-gray-100/80 shadow-soft-ui rounded-full py-2.5 px-3 sm:py-4 sm:px-8 flex flex-row items-center justify-between gap-1 sm:gap-4 select-none">
          {features.map((feat, idx) => (
            <React.Fragment key={idx}>
              {/* Feature Item */}
              <div 
                onClick={feat.onClick}
                className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 flex-1 justify-center cursor-pointer group hover:opacity-85 transition-opacity text-center sm:text-left"
              >
                {/* Icon Capsule */}
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gold-bg border border-[#EBDCD0]/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                {/* Text Group */}
                <div className="flex flex-col min-w-0 px-0.5">
                  <h4 className="text-[9px] sm:text-xs md:text-sm font-extrabold text-neutral-950 tracking-tight leading-tight group-hover:text-gold-accent transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-[7px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5 sm:mt-0.5">
                    {feat.subtext}
                  </p>
                </div>
              </div>

              {/* Separator */}
              {idx < features.length - 1 && (
                <Divider vertical className="h-5 sm:h-8 self-center bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeatureBar;
