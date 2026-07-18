import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MainLayout from '../layouts/MainLayout';

// Checkout-specific components
import CheckoutHeader from '../components/checkout/CheckoutHeader';
import AddressSection from '../components/checkout/AddressSection';
import CheckoutAddressDrawer from '../components/checkout/CheckoutAddressDrawer';
import DeliveryMethod, { DELIVERY_OPTIONS } from '../components/checkout/DeliveryMethod';
import CompactOrderCard from '../components/checkout/CompactOrderCard';
import PaymentAccordion from '../components/checkout/PaymentAccordion';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import PlaceOrderBar from '../components/checkout/PlaceOrderBar';

// Reuse Cart CouponCard (same component, same logic)
import CouponCard from '../components/cart/CouponCard';

/* ==========================================================================
   CheckoutPage
   - Master coordinator for the full checkout flow
   - Manages: address, delivery method, coupon, payment method, loading state
   - On "Place Order" → 1.5s dummy loading → navigate to /order-success
   ========================================================================== */

// Coupon definitions (same as CartPage)
const COUPONS = [
  { code: 'WELCOME10', value: 10, type: 'percent' },
  { code: 'SAVE500',   value: 500, type: 'flat' },
  { code: 'FIRSTBUY', value: 15, type: 'percent' },
];

const COD_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 100000;

const generateOrderId = () =>
  `MM${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  // ── Redirect if cart is empty ──────────────────────────────────────────────
  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems, navigate]);

  // ── Address state (persisted) ──────────────────────────────────────────────
  const [address, setAddress] = useState(() => {
    const saved = localStorage.getItem('mobimart_address');
    return saved ? JSON.parse(saved) : {
      name: 'Hitansh Sharma',
      phone: '+91 98765 43210',
      address: 'B-405, Premium Heights',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pin: '201301',
    };
  });
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveAddress = (newAddr) => {
    setAddress(newAddr);
    localStorage.setItem('mobimart_address', JSON.stringify(newAddr));
  };

  // ── Delivery method (persisted) ────────────────────────────────────────────
  const [deliveryMethod, setDeliveryMethod] = useState(() =>
    localStorage.getItem('mobimart_delivery') || 'standard'
  );
  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
    localStorage.setItem('mobimart_delivery', method);
  };

  const selectedDeliveryOption = DELIVERY_OPTIONS.find((o) => o.id === deliveryMethod);
  const deliveryCharge = selectedDeliveryOption?.charge ?? 0;
  const codFee = deliveryMethod === 'cod' ? COD_FEE : 0; // handled via payment method

  // ── Coupon state ───────────────────────────────────────────────────────────
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('mobimart_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [couponError, setCouponError] = useState('');

  const handleCouponApply = (coupon, err) => {
    if (err) { setCouponError(err); setAppliedCoupon(null); localStorage.removeItem('mobimart_coupon'); }
    else {
      setAppliedCoupon(coupon);
      setCouponError('');
      if (coupon) localStorage.setItem('mobimart_coupon', JSON.stringify(coupon));
    }
  };

  // ── Payment state (persisted) ──────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState(() =>
    localStorage.getItem('mobimart_payment_method') || 'upi'
  );
  const [paymentMethodData, setPaymentMethodData] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentErrors({});
    localStorage.setItem('mobimart_payment_method', method);
  };

  // ── Pricing calculations ───────────────────────────────────────────────────
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseInt(item.product.price.replace(/[^\d]/g, ''), 10);
    return acc + price * item.quantity;
  }, 0);

  const originalSubtotal = cartItems.reduce((acc, item) => {
    const orig = item.product.originalPrice || item.product.price;
    const price = parseInt(orig.replace(/[^\d]/g, ''), 10);
    return acc + price * item.quantity;
  }, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    else couponDiscount = Math.min(appliedCoupon.value, subtotal);
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const baseDeliveryCharge = isFreeShipping ? 0 : deliveryCharge;
  const codHandlingFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const totalSavings = (originalSubtotal - subtotal) + couponDiscount;
  const total = Math.max(0, subtotal - couponDiscount + baseDeliveryCharge + codHandlingFee);

  // ── Dummy payment validation ───────────────────────────────────────────────
  const validatePayment = () => {
    const errs = {};
    if (paymentMethod === 'upi' && !paymentMethodData?.upiId?.trim()) {
      errs.upiId = 'Please enter your UPI ID';
    }
    if ((paymentMethod === 'credit' || paymentMethod === 'debit')) {
      const card = paymentMethodData?.card || {};
      const cardErrs = {};
      if (!card.number || card.number.replace(/\s/g, '').length < 16) cardErrs.number = 'Enter valid 16-digit card number';
      if (!card.holder?.trim()) cardErrs.holder = 'Card holder name is required';
      if (!card.expiry || card.expiry.length < 5) cardErrs.expiry = 'Enter valid expiry (MM/YY)';
      if (!card.cvv || card.cvv.length < 3) cardErrs.cvv = 'Enter valid CVV';
      if (Object.keys(cardErrs).length) errs.card = cardErrs;
    }
    if (paymentMethod === 'netbanking' && !paymentMethodData?.bank) {
      errs.bank = 'Please select your bank';
    }
    if (paymentMethod === 'wallet' && !paymentMethodData?.wallet) {
      errs.wallet = 'Please select a wallet';
    }
    return errs;
  };

  // ── Place Order ────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = () => {
    // Validate address
    if (!address) { setIsAddressDrawerOpen(true); return; }

    // Validate payment (dummy)
    const errs = validatePayment();
    if (Object.keys(errs).length > 0) { setPaymentErrors(errs); return; }

    // Generate order and navigate
    const orderId = generateOrderId();
    setIsLoading(true);

    setTimeout(() => {
      // Persist order data for success page
      localStorage.setItem('mobimart_last_order', JSON.stringify({
        orderId,
        total,
        address,
        deliveryMethod,
        paymentMethod,
        itemCount: cartItems.length,
        items: cartItems.map((item) => ({
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          storage: item.selectedStorage,
          color: item.selectedColor,
          qty: item.quantity,
        })),
      }));
      clearCart();
      localStorage.removeItem('mobimart_coupon');
      navigate('/order-success');
    }, 1600);
  };

  return (
    <MainLayout>
      {/* Checkout-specific sticky header (Navbar is hidden via MainLayout) */}
      <CheckoutHeader step={1} />

      {/* Page body */}
      <div className="w-full bg-[#FAF9F6] min-h-screen pb-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto pt-6 flex flex-col gap-5">

          {/* ── DELIVERY ADDRESS ───────────────────────────────────────────── */}
          <AddressSection
            address={address}
            onChangeAddress={() => {
              setEditingAddress(address);
              setIsAddressDrawerOpen(true);
            }}
            onAddNew={() => {
              setEditingAddress(null);
              setIsAddressDrawerOpen(true);
            }}
          />

          {/* ── DELIVERY METHOD ────────────────────────────────────────────── */}
          <DeliveryMethod selected={deliveryMethod} onChange={handleDeliveryChange} />

          {/* ── ORDER ITEMS (compact read-only) ───────────────────────────── */}
          <div className="checkout-card">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
                Your Items
              </h2>
              <span className="text-[10px] font-bold text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {cartItems.map((item) => (
                <CompactOrderCard
                  key={`${item.product.id}-${item.selectedStorage}-${item.selectedColor}`}
                  item={item}
                />
              ))}
            </div>
          </div>

          {/* ── COUPON (reused from cart) ──────────────────────────────────── */}
          <CouponCard
            appliedCoupon={appliedCoupon}
            onApply={handleCouponApply}
            onRemove={() => { setAppliedCoupon(null); setCouponError(''); localStorage.removeItem('mobimart_coupon'); }}
            error={couponError}
          />

          {/* ── PAYMENT METHOD ACCORDION ───────────────────────────────────── */}
          <PaymentAccordion
            selectedMethod={paymentMethod}
            onMethodChange={handlePaymentMethodChange}
            methodData={paymentMethodData}
            onMethodDataChange={setPaymentMethodData}
            errors={paymentErrors}
          />

          {/* ── ORDER SUMMARY ──────────────────────────────────────────────── */}
          <CheckoutOrderSummary
            subtotal={subtotal}
            originalSubtotal={originalSubtotal}
            couponDiscount={couponDiscount}
            deliveryCharge={baseDeliveryCharge}
            codFee={codHandlingFee}
            totalSavings={totalSavings}
            total={total}
            appliedCouponName={appliedCoupon?.code || ''}
            isFreeShipping={isFreeShipping}
          />

          {/* ── TERMS ─────────────────────────────────────────────────────── */}
          <p className="text-[9px] text-gray-400 font-semibold text-center leading-relaxed pb-2">
            By placing this order you agree to MobiMart's{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
            All sales are final for opened devices.
          </p>

        </div>
      </div>

      {/* ── STICKY PLACE ORDER BAR ─────────────────────────────────────────── */}
      <PlaceOrderBar
        total={total}
        onPlaceOrder={handlePlaceOrder}
        isLoading={isLoading}
      />

      {/* ── ADDRESS DRAWER ─────────────────────────────────────────────────── */}
      <CheckoutAddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        editAddress={editingAddress}
        onSave={handleSaveAddress}
      />
    </MainLayout>
  );
};

export default CheckoutPage;
