import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Import subcomponents
import EmptyCart from '../components/cart/EmptyCart';
import CartItemCard from '../components/cart/CartItemCard';
import CouponCard from '../components/cart/CouponCard';
import PriceSummary from '../components/cart/PriceSummary';
import DeliveryCard from '../components/cart/DeliveryCard';
import CheckoutBar from '../components/cart/CheckoutBar';
import RecommendedProducts from '../components/cart/RecommendedProducts';
import AddressDrawer from '../components/cart/AddressDrawer';

/* ==========================================================================
   CartPage Component
   - Coordinates overall cart state: subtotals, active coupons, and address hooks
   - Manages AddressDrawer and CheckoutSuccessModal overlay visibility states
   - Renders EmptyCart if item list is clear, or full cart layout otherwise
   ========================================================================== */

export const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Drawer/Modal visibility state
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    name: 'Hitansh Sharma',
    phone: '+91 98765 43210',
    line1: 'B-405, Premium Heights',
    line2: 'Sector 62, Noida, UP - 201301',
  });

  // ──────────────────────────────────────────────────────────────
  // Pricing calculations
  // ──────────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.product.price.replace(/[^\d]/g, ''), 10);
    return acc + priceNum * item.quantity;
  }, 0);

  const originalSubtotal = cartItems.reduce((acc, item) => {
    const origPrice = item.product.originalPrice || item.product.price;
    const priceNum = parseInt(origPrice.replace(/[^\d]/g, ''), 10);
    return acc + priceNum * item.quantity;
  }, 0);

  const catalogDiscount = originalSubtotal - subtotal;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      couponDiscount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const freeShippingThreshold = 100000;
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const totalSavings = catalogDiscount + couponDiscount;
  const total = Math.max(0, subtotal - couponDiscount + shippingCharge);

  // ──────────────────────────────────────────────────────────────
  // Coupon handlers
  // ──────────────────────────────────────────────────────────────
  const handleCouponApply = (coupon, err) => {
    if (err) {
      setCouponError(err);
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(coupon);
      setCouponError('');
    }
  };

  // ──────────────────────────────────────────────────────────────
  // Checkout handler: opens success modal, clears cart on close
  // ──────────────────────────────────────────────────────────────
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // ──────────────────────────────────────────────────────────────
  // Address save handler
  // ──────────────────────────────────────────────────────────────
  const handleAddressSave = (newAddress) => {
    setShippingAddress(newAddress);
    setIsAddressDrawerOpen(false);
  };

  return (
    <MainLayout>
      <div className="w-full bg-[#FAF9F6] pb-24 px-4 sm:px-6 md:px-8 min-h-[70vh]">

        {/* Navigation Breadcrumb */}
        <div className="max-w-5xl mx-auto py-4 text-left select-none">
          <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
            <Link to="/store" className="hover:text-gold-accent transition-colors">Store</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-neutral-900 font-black">Shopping Cart</span>
          </p>
        </div>

        <div className="max-w-5xl mx-auto text-left">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-1 select-none">
            Shopping Cart
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 select-none">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for checkout
          </p>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col gap-8">

              {/* Main 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: Items + Delivery (span 7) */}
                <div className="md:col-span-7 flex flex-col gap-5">

                  {/* Cart Items List */}
                  <div className="bg-white border border-gray-150/40 rounded-3xl p-4 shadow-soft-ui flex flex-col gap-1">
                    {/* Section header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-1 px-1">
                      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
                        Cart Items
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {cartItems.map((item) => (
                        <CartItemCard
                          key={`${item.product.id}-${item.selectedStorage}-${item.selectedColor}`}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <DeliveryCard
                    address={shippingAddress}
                    onOpenAddressChange={() => setIsAddressDrawerOpen(true)}
                  />
                </div>

                {/* RIGHT COLUMN: Coupons + Pricing (span 5) */}
                <div className="md:col-span-5 flex flex-col gap-5">

                  {/* Coupon Card */}
                  <CouponCard
                    appliedCoupon={appliedCoupon}
                    onApply={handleCouponApply}
                    onRemove={() => { setAppliedCoupon(null); setCouponError(''); }}
                    error={couponError}
                  />

                  {/* Price Summary */}
                  <PriceSummary
                    subtotal={subtotal}
                    originalSubtotal={originalSubtotal}
                    couponDiscount={couponDiscount}
                    shippingCharge={shippingCharge}
                    totalSavings={totalSavings}
                    total={total}
                    appliedCouponName={appliedCoupon ? appliedCoupon.code : ''}
                  />
                </div>

              </div>

              {/* Recommended Products horizontal scroll */}
              <RecommendedProducts cartItems={cartItems} />

            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <CheckoutBar
          total={total}
          onCheckout={handleCheckout}
        />
      )}

      {/* Address Edit Bottom Sheet Drawer */}
      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        address={shippingAddress}
        onSave={handleAddressSave}
      />

    </MainLayout>
  );
};

export default CartPage;
