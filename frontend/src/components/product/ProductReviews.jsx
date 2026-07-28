import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ThumbsUp, ChevronDown, Edit2, Trash2, X, PlusCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../api/services';

export const ProductReviews = ({ product }) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [sortOption, setSortOption] = useState('Most Recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, setAuthModalOpen } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = () => {
    if (product?._id || product?.id) {
      setIsLoading(true);
      reviewService.getProductReviews(product._id || product.id)
        .then(res => setReviews(res.data.data.reviews || []))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const handleHelpfulClick = async (reviewId) => {
    try {
      await reviewService.markHelpful(reviewId);
      setHelpfulCounts((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1
      }));
      showToast('Marked review as helpful', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'Highest Rating') return b.rating - a.rating;
    if (sortOption === 'Lowest Rating') return a.rating - b.rating;
    if (sortOption === 'Most Helpful') return b.helpful - a.helpful;
    return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()); // Most Recent
  });

  const openWriteReview = (review = null) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (review) {
      setEditingReviewId(review._id);
      setReviewForm({ rating: review.rating, title: review.title || '', comment: review.comment || review.content || '' });
    } else {
      setEditingReviewId(null);
      setReviewForm({ rating: 5, title: '', comment: '' });
    }
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        await reviewService.updateReview(editingReviewId, reviewForm);
        showToast('Review updated successfully', 'success');
      } else {
        await reviewService.addReview({
          productId: product._id || product.id,
          ...reviewForm
        });
        showToast('Review submitted successfully', 'success');
      }
      setIsModalOpen(false);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await reviewService.deleteReview(id);
      showToast('Review deleted successfully', 'success');
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review', 'error');
    }
  };

  if (isLoading) {
    return <div className="p-5 text-center text-xs font-bold text-gray-400">Loading reviews...</div>;
  }

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-6">
      
      {/* 1. Header with Sort options */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 relative flex-wrap gap-2">
        <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 uppercase tracking-wider">
          Customer Reviews
        </h3>
        
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => openWriteReview()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white rounded-lg text-[10.5px] font-bold hover:bg-neutral-800 transition-colors"
          >
            <PlusCircle size={12} />
            <span className="hidden sm:inline">Write Review</span>
            <span className="sm:hidden">Write</span>
          </button>
          <button 
            type="button"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[10.5px] font-bold text-gray-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <span>{sortOption}</span>
            <ChevronDown size={12} strokeWidth={2.4} />
          </button>

          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30 w-36 text-xs font-bold text-neutral-800">
              {['Most Recent', 'Highest Rating', 'Lowest Rating', 'Most Helpful'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSortOption(opt);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-neutral-100 transition-colors ${
                    sortOption === opt ? 'text-gold-accent font-black' : ''
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Overall Review Summary */}
      <ReviewSummary 
        rating={product.averageRating || product.rating || 0} 
        reviewCount={product.reviewCount || reviews.length} 
        reviews={reviews}
      />

      {/* 3. Dynamic Reviews Cards list */}
      <div className="flex flex-col gap-4 border-t border-gray-100/50 pt-5">
        {sortedReviews.length === 0 ? (
          <p className="text-center text-xs font-bold text-gray-500 py-4">No reviews yet for this product.</p>
        ) : (
          sortedReviews.map((rev) => (
            <ReviewCard
              key={rev._id}
              review={rev}
              currentUser={user}
              helpfulIncrement={helpfulCounts[rev._id] || 0}
              onHelpful={() => handleHelpfulClick(rev._id)}
              onEdit={() => openWriteReview(rev)}
              onDelete={() => handleDeleteReview(rev._id)}
            />
          ))
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative p-6 animate-fade-in text-left">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </h2>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Rating</label>
                <div className="flex items-center gap-2 text-amber-500 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      className={star <= reviewForm.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'} 
                      strokeWidth={1}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Title (Optional)</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full bg-[#ECEFF2]/30 focus:bg-white text-xs text-neutral-850 px-4 py-2.5 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all"
                  placeholder="Summarize your experience"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-neutral-900 uppercase tracking-wider">Review</label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                  className="w-full bg-[#ECEFF2]/30 focus:bg-white text-xs text-neutral-850 px-4 py-2.5 rounded-xl border border-neutral-200/50 focus:outline-none focus:border-[#C5A880] transition-all resize-none"
                  placeholder="What did you like or dislike?"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-black rounded-xl flex items-center justify-center mt-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewSummary = ({ rating = 0, reviewCount = 0, reviews = [] }) => {
  // Calculate dynamic star distributions from reviews array
  const totalReviews = reviews.length;
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach((rev) => {
    const star = Math.round(rev.rating);
    if (counts[star] !== undefined) {
      counts[star]++;
    }
  });

  const distributions = [5, 4, 3, 2, 1].map((stars) => {
    const percentage = totalReviews > 0 ? Math.round((counts[stars] / totalReviews) * 100) : 0;
    return { stars, percentage };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-neutral-100">
      <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
        <span className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tighter">
          {Number(rating).toFixed(1)}
        </span>
        
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

      <div className="sm:col-span-8 flex flex-col gap-1.5 w-full">
        {distributions.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-3 w-full">
            <span className="text-[10px] font-black text-neutral-700 w-3 shrink-0 text-right">
              {dist.stars}★
            </span>
            
            <div className="flex-grow h-1.5 bg-neutral-200/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                style={{ width: `${dist.percentage}%` }}
              />
            </div>
            
            <span className="text-[10px] font-bold text-gray-400 w-7 shrink-0 text-right">
              {dist.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReviewCard = ({ review, currentUser, helpfulIncrement = 0, onHelpful, onEdit, onDelete }) => {
  const reviewerName = review.user?.name || review.name || 'Anonymous User';
  const reviewerId = review.user?._id || review.user;
  const isOwner = currentUser && currentUser._id === reviewerId;
  const displayDate = new Date(review.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="flex flex-col gap-2.5 text-left border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-250 flex items-center justify-center text-xs font-black text-white uppercase select-none">
            {reviewerName.charAt(0)}
          </div>
          <div>
            <h4 className="text-[11.5px] font-extrabold text-neutral-900 leading-none">
              {reviewerName}
            </h4>
            {(review.isVerifiedPurchase || review.verified) && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9.5px] font-black text-green-600 flex items-center gap-0.5">
                  <ShieldCheck size={11} strokeWidth={2.4} />
                  <span>Verified Buyer</span>
                </span>
              </div>
            )}
          </div>
        </div>
        
        <span className="text-[9.5px] text-gray-450 font-bold">
          {displayDate}
        </span>
      </div>

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

      {review.title && <h5 className="text-[11px] font-bold text-neutral-800">{review.title}</h5>}

      <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed font-semibold">
        {review.comment || review.content}
      </p>

      <div className="flex items-center justify-between mt-0.5">
        <button
          type="button"
          onClick={onHelpful}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-neutral-100 border border-gray-200 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-500 hover:text-neutral-900 transition-all cursor-pointer"
        >
          <ThumbsUp size={11} />
          <span>Helpful ({(review.helpful || 0) + helpfulIncrement})</span>
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit2 size={11} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
