import Coupon from '../models/Coupon.model.js';
import ApiError from '../utils/ApiError.js';

export const createCoupon = async (couponData) => {
  const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
  if (existingCoupon) {
    throw new ApiError(409, 'Coupon code already exists');
  }

  const coupon = await Coupon.create(couponData);
  return coupon;
};

export const validateAndApplyCoupon = async (code, cartTotal) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new ApiError(404, 'Invalid or inactive coupon');
  }

  const now = new Date();
  if (now < coupon.startDate) {
    throw new ApiError(400, 'Coupon is not yet valid');
  }
  if (now > coupon.endDate) {
    throw new ApiError(400, 'Coupon has expired');
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached');
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    throw new ApiError(400, `Minimum purchase amount of ₹${coupon.minPurchaseAmount} is required for this coupon`);
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else if (coupon.type === 'fixed') {
    discount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed cart total
  discount = Math.min(discount, cartTotal);

  return {
    couponId: coupon._id,
    code: coupon.code,
    discount,
  };
};

export const getAllCoupons = async (query = {}) => {
  const { page = 1, limit = 10, isActive } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const coupons = await Coupon.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Coupon.countDocuments(filter);

  return {
    coupons,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCouponById = async (id) => {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(404, 'Coupon not found');
  }
  return coupon;
};

export const recordCouponUsage = async (couponId) => {
  const coupon = await Coupon.findOneAndUpdate(
    {
      _id: couponId,
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ["$usageCount", "$usageLimit"] } }
      ]
    },
    { $inc: { usageCount: 1 } },
    { new: true }
  );

  if (!coupon) {
    throw new ApiError(400, 'Coupon usage limit has been reached');
  }
  return coupon;
};
