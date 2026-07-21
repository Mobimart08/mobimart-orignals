import React from 'react';
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
import mobimartOriginalsBannerBg from '../assets/mobimart_originals_banner_bg.png';
import mobimartLogo from '../assets/mobimart_logo.png';



/* ==========================================================================
   Home Page Component
   - Renders the long webpage containing all slices in sequence
   - Wrapped in MainLayout
   ========================================================================== */

export const Home = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MobiMart Premium",
    "url": "https://www.mobimart.in",
    "logo": "https://www.mobimart.in/assets/mobimart_logo.png",
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
          {/* Banner Background */}
          <img 
            src={mobimartOriginalsBannerBg} 
            alt="Mobimart Originals Banner Background" 
            width="1024"
            height="576"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
          {/* Logo Overlay - covering 80% height of the banner, centered */}
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

        {/* Sections: */}
        <ScrollReveal>
          <Hero />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <FeatureBar />
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
          <WhyChoose />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <TradeBanner />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Reviews />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Newsletter />
        </ScrollReveal>
      </div>
    </MainLayout>
  );
};

export default Home;
