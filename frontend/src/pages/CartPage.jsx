import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../api/services';

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
  const { user } = useAuth();

  // Drawer/Modal visibility state
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    name: 'Default Recipient',
    phone: 'Enter Phone',
    line1: 'No shipping address selected',
    line2: 'Please add a shipping address',
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      try {
        const res = await addressService.getAddresses();
        const addresses = res.data?.data || [];
        if (addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setShippingAddress({
            _id: defaultAddr._id,
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            line1: defaultAddr.addressLine1,
            line2: [defaultAddr.addressLine2, defaultAddr.landmark].filter(Boolean).join(', '),
            city: defaultAddr.city,
            state: defaultAddr.state,
            pinCode: defaultAddr.pinCode,
            country: defaultAddr.country
          });
        }
      } catch (error) {
        console.error('Failed to fetch addresses on cart:', error);
      }
    };
    fetchAddress();
  }, [user]);

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
    return 0;
  };

  // ──────────────────────────────────────────────────────────────
  // Pricing calculations
  // ──────────────────────────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => {
    const prod = item.product || item.productId;
    if (!prod) return acc;
    const priceNum = parsePrice(prod.price);
    return acc + priceNum * item.quantity;
  }, 0);

  const originalSubtotal = cartItems.reduce((acc, item) => {
    const prod = item.product || item.productId;
    if (!prod) return acc;
    const origPrice = prod.originalPrice || prod.price;
    const priceNum = parsePrice(origPrice);
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

  // Use backend-calculated delivery charges instead of hardcoded threshold
  const shippingCharge = cartTotals.totalDeliveryCharge || 0;
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
    navigate('/checkout', { state: { shippingAddress } });
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
        <div className="max-w-[960px] mx-auto py-4 text-left select-none">
          <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">
            <Link to="/store" className="hover:text-gold-accent transition-colors">Store</Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-neutral-900 font-black">Shopping Cart</span>
          </p>
        </div>

        <div className="max-w-[960px] mx-auto text-left">
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
                      {cartItems.map((item) => {
                        const prod = item.product || item.productId;
                        
                        if (!prod) {
                          return (
                            <div key={item._id || Math.random()} className="w-full flex items-center justify-between p-4 border border-red-100 bg-red-50/50 rounded-2xl text-left">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-red-600">Product Unavailable</span>
                                <span className="text-[10px] text-gray-500">This item is no longer available and was removed from catalog.</span>
                              </div>
                              <button
                                onClick={() => removeFromCart(null, item.selectedStorage, item.selectedColor, item.selectedRam, item._id)}
                                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-[10px] font-bold rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        }

                        return (
                          <CartItemCard
                            key={`${prod.id || prod._id}-${item.selectedStorage}-${item.selectedColor}-${item.selectedRam}`}
                            item={{ ...item, product: prod }}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <DeliveryCard
                    address={shippingAddress}
                    onOpenAddressChange={() => setIsAddressDrawerOpen(true)}
                  />
                </div>

                {/* RIGHT COLUMN: Coupons + Pricing (span 5) */}
                <div className="md:col-span-5 flex flex-col gap-5 sticky top-24 h-fit">

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
