import React from 'react';

/* ==========================================================================
   MobiMart Luxury Shimmer Skeleton Components
   - Features custom shimmer keyframes loaded from index.css
   - Color scheme: Off-white and light gray gradients
   - Linear duration: 1.4s
   ========================================================================== */

// Base Shimmer wrapper utility
export const Shimmer = ({ className = '', children, ...props }) => (
  <div 
    className={`animate-shimmer rounded-lg bg-gray-200/50 select-none ${className}`} 
    aria-hidden="true"
    {...props}
  >
    {children}
  </div>
);

// 1. SkeletonText - lines of text placeholder
export const SkeletonText = ({ className = '', width = 'w-full', height = 'h-3.5', ...props }) => (
  <Shimmer className={`${width} ${height} ${className}`} {...props} />
);

// 2. SkeletonCircle - circular element placeholder (avatars, icons)
export const SkeletonCircle = ({ className = '', size = 'w-10 h-10', ...props }) => (
  <Shimmer className={`${size} rounded-full ${className}`} {...props} />
);

// 3. SkeletonButton - CTA button placeholder
export const SkeletonButton = ({ className = '', width = 'w-24', height = 'h-9', ...props }) => (
  <Shimmer className={`${width} ${height} rounded-full ${className}`} {...props} />
);

// 4. SkeletonCard - generic container outline
export const SkeletonCard = ({ className = '', height = 'h-40', ...props }) => (
  <div className={`bg-white border border-gray-150/40 rounded-3xl p-5 shadow-soft-ui flex flex-col gap-3 ${className}`}>
    <Shimmer className={`w-full ${height} rounded-2xl`} {...props} />
    <SkeletonText width="w-2/3" />
    <SkeletonText width="w-1/2" />
  </div>
);

// 5. SkeletonProduct - matches ProductCard layout
export const SkeletonProduct = ({ className = '' }) => (
  <div className={`bg-white border border-gray-150/40 rounded-2xl p-4 flex flex-col gap-4 shadow-soft-ui ${className}`}>
    {/* Product Image placeholder */}
    <Shimmer className="w-full aspect-square rounded-xl" />
    {/* Specs details */}
    <div className="flex flex-col gap-2 flex-grow justify-between">
      <div className="flex flex-col gap-1.5">
        <SkeletonText width="w-3/4" height="h-4" />
        <SkeletonText width="w-1/2" height="h-3" />
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <SkeletonText width="w-1/3" height="h-4" />
        <SkeletonButton width="w-full" height="h-8.5" />
      </div>
    </div>
  </div>
);

// 6. SkeletonBanner - matches banner collections
export const SkeletonBanner = ({ className = '' }) => (
  <div className={`bg-white border border-gray-150/40 rounded-3xl p-6 sm:p-10 flex flex-row items-center justify-between relative overflow-hidden h-[220px] sm:h-[300px] ${className}`}>
    {/* Left text outlines */}
    <div className="flex flex-col items-start gap-3 w-[50%] z-10">
      <SkeletonText width="w-3/4" height="h-6 sm:h-8" />
      <SkeletonText width="w-full" height="h-3 sm:h-4" />
      <SkeletonText width="w-2/3" height="h-3 sm:h-4" />
      <SkeletonButton className="mt-2" />
    </div>
    {/* Right image box */}
    <Shimmer className="absolute top-0 bottom-0 right-0 w-[45%] h-full rounded-none" />
  </div>
);

// 7. SkeletonReview - matches customer feedback cards
export const SkeletonReview = ({ className = '' }) => (
  <div className={`bg-white border border-gray-150/40 rounded-3xl p-5 shadow-soft-ui flex flex-col gap-3 text-left ${className}`}>
    <div className="flex items-center gap-3">
      <SkeletonCircle size="w-9 h-9" />
      <div className="flex flex-col gap-1 flex-1">
        <SkeletonText width="w-1/3" height="h-3.5" />
        <SkeletonText width="w-1/4" height="h-2.5" />
      </div>
    </div>
    <SkeletonText width="w-full" />
    <SkeletonText width="w-5/6" />
  </div>
);

// 8. SkeletonOrder - matches Dashboard order details
export const SkeletonOrder = ({ className = '' }) => (
  <div className={`bg-white border border-gray-150/40 rounded-3xl p-4 sm:p-5 shadow-soft-ui flex flex-col gap-4 ${className}`}>
    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <SkeletonText width="w-12" height="h-2.5" />
          <SkeletonText width="w-16" height="h-3" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonText width="w-12" height="h-2.5" />
          <SkeletonText width="w-20" height="h-3" />
        </div>
      </div>
      <Shimmer className="w-16 h-4.5 rounded-full" />
    </div>
    <div className="flex gap-3.5 items-center">
      <Shimmer className="w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <SkeletonText width="w-1/3" height="h-3.5" />
        <SkeletonText width="w-1/2" height="h-2.5" />
      </div>
    </div>
  </div>
);

// 9. SkeletonAddress - matches SavedAddresses cards
export const SkeletonAddress = ({ className = '' }) => (
  <div className={`bg-white border border-gray-150/40 rounded-3xl p-4 shadow-soft-ui flex gap-3.5 ${className}`}>
    <SkeletonCircle size="w-8 h-8 shrink-0" />
    <div className="flex-grow flex flex-col gap-2">
      <SkeletonText width="w-1/4" height="h-3.5" />
      <SkeletonText width="w-1/3" height="h-3" />
      <SkeletonText width="w-5/6" height="h-2.5" />
      <SkeletonText width="w-2/3" height="h-2.5" />
    </div>
  </div>
);

// 10. SkeletonCheckout - matches checkout progress elements
export const SkeletonCheckout = ({ className = '' }) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    <SkeletonBanner />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col gap-4">
        <SkeletonCard height="h-32" />
        <SkeletonCard height="h-44" />
      </div>
      <div className="flex flex-col gap-4">
        <SkeletonCard height="h-60" />
      </div>
    </div>
  </div>
);

// 11. SkeletonDashboard - dashboard Hero stat highlights
export const SkeletonDashboard = ({ className = '' }) => (
  <div className={`flex flex-col gap-6 ${className}`}>
    {/* WelcomeHero skeleton */}
    <div className="bg-[#FAF9F6] border border-neutral-200/40 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-center">
      <div className="flex flex-col gap-3 flex-1">
        <Shimmer className="w-20 h-5 rounded-full" />
        <SkeletonText width="w-2/3" height="h-7" />
        <SkeletonText width="w-1/2" height="h-4" />
      </div>
      <div className="flex gap-3">
        <Shimmer className="w-24 h-24 rounded-2xl" />
        <Shimmer className="w-24 h-24 rounded-2xl" />
        <Shimmer className="w-24 h-24 rounded-2xl" />
      </div>
    </div>
    
    {/* Grid of details skeletons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonOrder />
      <SkeletonAddress />
    </div>
  </div>
);
