import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MoreHorizontal, ChevronDown } from 'lucide-react';

/* ==========================================================================
   ProductReviews Component (Slice 4)
   - Parent wrapper managing the entire reviews layout on the PDP
   - Mounts ReviewSummary to show general star metrics
   - Lists client feedback cards dynamically
   ========================================================================== */

export const ProductReviews = ({ product }) => {
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [sortOption, setSortOption] = useState('Most Recent');

  const handleHelpfulClick = (idx) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1
    }));
  };

  // Safe check for reviews array
  const reviews = product.reviews && product.reviews.length > 0 ? product.reviews : [
    { name: 'Arjun Mehta', rating: 5, date: '12 May 2024', verified: true, content: 'Excellent condition and battery health is as described. Delivery was super fast!', helpful: 24 },
    { name: 'Neha Kapoor', rating: 5, date: '10 May 2024', verified: true, content: 'Amazing experience. Phone looks and works like new. Totally worth it!', helpful: 18 },
    { name: 'Rohit Sharma', rating: 5, date: '8 May 2024', verified: true, content: 'Smooth purchase and genuine product. Highly recommended.', helpful: 12 }
  ];

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-6">
      
      {/* 1. Header with Sort options */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 uppercase tracking-wider">
          Customer Reviews
        </h3>
        
        {/* Sort Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => alert('Sorting reviews list simulated!')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[10.5px] font-bold text-gray-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <span>{sortOption}</span>
            <ChevronDown size={12} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* 2. Overall Review Summary & distributions */}
      <ReviewSummary 
        rating={product.rating || 4.8} 
        reviewCount={product.reviewCount || 421} 
      />

      {/* 3. Dynamic Reviews Cards list */}
      <div className="flex flex-col gap-4 border-t border-gray-100/50 pt-5">
        {reviews.map((rev, idx) => (
          <ReviewCard
            key={idx}
            review={rev}
            index={idx}
            helpfulIncrement={helpfulCounts[idx] || 0}
            onHelpful={handleHelpfulClick}
          />
        ))}
      </div>

      {/* 4. View All Reviews button */}
      <button
        type="button"
        onClick={() => alert('View All Reviews simulated!')}
        className="mx-auto px-6 py-2.5 text-[10.5px] font-black text-neutral-850 bg-white hover:bg-neutral-50 border border-neutral-250 rounded-full transition-all cursor-pointer shadow-sm text-center"
      >
        View All Reviews
      </button>

    </div>
  );
};

/* ==========================================================================
   ReviewSummary Subcomponent
   - Displays the large rating average (4.8)
   - Displays the horizontal progress metrics bars (Slice 4)
   ========================================================================== */

export const ReviewSummary = ({ rating = 4.8, reviewCount = 421 }) => {
  // Distribution ratings weights matching Slice 4
  const distributions = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-neutral-100">
      
      {/* Average rating summary box */}
      <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
        <span className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tighter">
          {rating}
        </span>
        
        {/* Star icons row */}
        <div className="flex items-center gap-0.5 mt-2 mb-1.5 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={15} 
              className={i < Math.floor(rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'} 
              strokeWidth={0}
            />
          ))}
        </div>

        <span className="text-[10px] sm:text-xs text-gray-400 font-bold">
          ({reviewCount} Reviews)
        </span>
      </div>

      {/* Progress Bars distribution list */}
      <div className="sm:col-span-8 flex flex-col gap-1.5 w-full">
        {distributions.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-3 w-full">
            {/* Stars count */}
            <span className="text-[10px] font-black text-neutral-700 w-3 shrink-0 text-right">
              {dist.stars}★
            </span>
            
            {/* Progress track */}
            <div className="flex-grow h-1.5 bg-neutral-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                style={{ width: `${dist.percentage}%` }}
              ></div>
            </div>
            
            {/* Percentage weight label */}
            <span className="text-[10px] font-bold text-gray-400 w-7 shrink-0 text-right">
              {dist.percentage}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

/* ==========================================================================
   ReviewCard Subcomponent
   - Displays individual customer reviews
   - verified badges, helpful thumbs counters, and timestamp
   ========================================================================== */

export const ReviewCard = ({ review, index, helpfulIncrement = 0, onHelpful }) => {
  return (
    <div className="flex flex-col gap-2.5 text-left border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
      
      {/* Top author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Avatar circle placeholder */}
          <div className="w-8 h-8 rounded-full bg-neutral-250 flex items-center justify-center text-xs font-black text-white uppercase select-none">
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-[11.5px] font-extrabold text-neutral-900 leading-none">
              {review.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              {review.verified && (
                <span className="text-[9.5px] font-black text-green-600 flex items-center gap-0.5">
                  <ShieldCheck size={11} strokeWidth={2.4} />
                  <span>Verified Buyer</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Review Timestamp */}
        <span className="text-[9.5px] text-gray-450 font-bold">
          {review.date}
        </span>
      </div>

      {/* Dynamic Star Rating row for card */}
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={11.5} 
            className={i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'} 
            strokeWidth={0}
          />
        ))}
      </div>

      {/* Testimonial review content */}
      <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed font-semibold">
        {review.content}
      </p>

      {/* Bottom controls row */}
      <div className="flex items-center justify-between mt-0.5">
        <button
          type="button"
          onClick={() => onHelpful && onHelpful(index)}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-neutral-100 border border-gray-200 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-500 hover:text-neutral-900 transition-all cursor-pointer"
        >
          <ThumbsUp size={11} />
          <span>Helpful ({review.helpful + helpfulIncrement})</span>
        </button>

        <button 
          type="button"
          onClick={() => alert('Options menu simulated!')}
          className="p-1.5 hover:bg-neutral-100 rounded-full text-gray-400 hover:text-neutral-800 cursor-pointer"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

    </div>
  );
};

export default ProductReviews;
