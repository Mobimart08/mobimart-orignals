import Review from '../models/Review.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

// Helper to update product rating stats
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId, isApproved: true } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const update = stats.length > 0
    ? { averageRating: Math.round(stats[0].averageRating * 10) / 10, reviewCount: stats[0].reviewCount }
    : { averageRating: 0, reviewCount: 0 };

  await Product.findByIdAndUpdate(productId, update);
};

export const createReview = async (userId, userName, reviewData) => {
  const { productId, rating, title, content } = reviewData;

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, userId });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  // Check for verified purchase
  const hasPurchased = await Order.findOne({
    userId,
    'items.productId': productId,
    orderStatus: ORDER_STATUS.DELIVERED,
  });

  const review = await Review.create({
    productId,
    userId,
    userName,
    rating,
    title,
    content,
    isVerifiedPurchase: !!hasPurchased,
  });

  await updateProductRating(productId);

  return review;
};

export const getProductReviews = async (productId, query = {}) => {
  const { page = 1, limit = 10, sortBy = 'newest' } = query;
  const skip = (page - 1) * limit;

  const filter = { productId, isApproved: true };

  let sort = { createdAt: -1 };
  if (sortBy === 'highest') sort = { rating: -1, createdAt: -1 };
  if (sortBy === 'lowest') sort = { rating: 1, createdAt: -1 };
  if (sortBy === 'helpful') sort = { helpful: -1, createdAt: -1 };

  const reviews = await Review.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments(filter);

  return {
    reviews,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, userId });
  
  if (!review) {
    throw new ApiError(404, 'Review not found or unauthorized');
  }

  if (updateData.rating) review.rating = updateData.rating;
  if (updateData.title) review.title = updateData.title;
  if (updateData.content) review.content = updateData.content;

  await review.save();
  await updateProductRating(review.productId);

  return review;
};

export const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, userId });
  
  if (!review) {
    throw new ApiError(404, 'Review not found or unauthorized');
  }

  await updateProductRating(review.productId);
};

export const markHelpful = async (reviewId) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  );

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  return review;
};

export const getAllReviewsAdmin = async (query = {}) => {
  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find()
    .populate('productId', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments();

  return {
    reviews,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const approveReview = async (reviewId, isApproved) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { isApproved },
    { new: true }
  );

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  await updateProductRating(review.productId);
  return review;
};

export const deleteReviewAdmin = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  await updateProductRating(review.productId);
};
