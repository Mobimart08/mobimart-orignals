import * as couponService from '../services/coupon.service.js';
import { getCartByUserId } from '../services/cart.service.js';

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const cart = await getCartByUserId(req.user._id);
    const cartTotal = cart.subtotal || 0;
    
    const result = await couponService.validateAndApplyCoupon(code, cartTotal);
    
    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const result = await couponService.getAllCoupons(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
