import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/home/Hero';
import FeatureBar from '../components/home/FeatureBar';
import BrandGrid from '../components/home/BrandGrid';
import Collections from '../components/home/Collections';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyChoose from '../components/home/WhyChoose';
import TradeBanner from '../components/home/TradeBanner';
import Reviews from '../components/home/Reviews';
import Newsletter from '../components/home/Newsletter';
import SEO from '../components/ui/SEO';
import ScrollReveal from '../components/ui/ScrollReveal';
import { CertificationModal, WarrantyModal, ShippingPolicyModal, WhyChooseModal } from '../components/ui/InfoModals';
import ComingSoonBottomSheet from '../components/ui/ComingSoonBottomSheet';
import mobimartOriginalsBannerBg from '../assets/mobimart_originals_banner_bg.webp';
import mobimartLogo from '../assets/mobimart_logo.webp';

export const Home = () => {
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isWhyChooseModalOpen, setIsWhyChooseModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('Feature Coming Soon');

  const openComingSoon = (title = 'Sell Your Device') => {
    setComingSoonTitle(title);
    setIsComingSoonOpen(true);
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MobiMart Premium",
    "url": "https://www.mobimart.in",
    "logo": "https://www.mobimart.in/assets/mobimart_logo.webp",
    "description": "Premium certified pre-owned and refurbished smartphones.",
    "sameAs": [
      "https://www.facebook.com/mobimart",
      "https://www.twitter.com/mobimart",
      "https://www.instagram.com/mobimart"
    ]
  };

  return (
    <MainLayout>
      <SEO 
        title="Premium Certified Smartphones" 
        description="MobiMart: Premium certified pre-owned and refurbished smartphones. Original Apple, Samsung, Google Pixel devices checked for quality."
        path="/"
        schema={orgSchema}
      />
      <div className="flex flex-col w-full min-h-screen">
        {/* Mobimart Originals Banner (Mobile Only) */}
        <div className="block md:hidden w-full overflow-hidden aspect-[16/9] relative animate-banner-fade-in">
          <img 
            src={mobimartOriginalsBannerBg} 
            alt="Mobimart Originals Banner Background" 
            width="1024"
            height="576"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img 
              src={mobimartLogo} 
              alt="Mobimart Originals Logo" 
              width="612"
              height="408"
              loading="lazy"
              decoding="async"
              className="h-[80%] w-auto object-contain"
            />
          </div>
        </div>

        {/* Sections */}
        <ScrollReveal>
          <Hero onSellClick={() => openComingSoon('Sell Your Device')} />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <FeatureBar 
            onCertifiedClick={() => setIsCertModalOpen(true)}
            onWarrantyClick={() => setIsWarrantyModalOpen(true)}
            onShippingClick={() => setIsShippingModalOpen(true)}
          />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <BrandGrid />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Collections />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <FeaturedProducts />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <WhyChoose onCardClick={() => setIsWhyChooseModalOpen(true)} />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <TradeBanner onDiscoverClick={() => openComingSoon('Trade-In Program')} />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Reviews />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Newsletter />
        </ScrollReveal>
      </div>

      {/* Modals & Sheets */}
      <CertificationModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} />
      <WarrantyModal isOpen={isWarrantyModalOpen} onClose={() => setIsWarrantyModalOpen(false)} />
      <ShippingPolicyModal isOpen={isShippingModalOpen} onClose={() => setIsShippingModalOpen(false)} />
      <WhyChooseModal isOpen={isWhyChooseModalOpen} onClose={() => setIsWhyChooseModalOpen(false)} />
      <ComingSoonBottomSheet isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} title={comingSoonTitle} />
    </MainLayout>
  );
};

export default Home;
