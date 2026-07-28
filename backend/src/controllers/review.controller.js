import * as reviewService from '../services/review.service.js';

export const submitReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userName = req.user.name;
    const reviewData = req.body;

    const review = await reviewService.createReview(userId, userName, reviewData);
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await reviewService.getProductReviews(productId, req.query);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    
    const review = await reviewService.updateReview(reviewId, userId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    
    await reviewService.deleteReview(reviewId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const markReviewHelpful = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    await reviewService.markHelpful(reviewId);
    
    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
    });
  } catch (error) {
    next(error);
  }
};

// Admin Controllers
export const getAllReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviewsAdmin(req.query);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { isApproved } = req.body; // Expecting boolean

    const review = await reviewService.approveReview(reviewId, isApproved);
    
    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    
    await reviewService.deleteReviewAdmin(reviewId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully by admin',
    });
  } catch (error) {
    next(error);
  }
};
