import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { addressService, couponService, ordersService, paymentService } from '../api/services';
import MainLayout from '../layouts/MainLayout';
import { useToast } from '../context/ToastContext';

// Checkout-specific components
import CheckoutHeader from '../components/checkout/CheckoutHeader';
import AddressSection from '../components/checkout/AddressSection';
import CheckoutAddressModal from '../components/checkout/CheckoutAddressModal';
import DeliveryMethod, { DELIVERY_OPTIONS } from '../components/checkout/DeliveryMethod';
import CompactOrderCard from '../components/checkout/CompactOrderCard';
import PaymentAccordion from '../components/checkout/PaymentAccordion';
import CheckoutOrderSummary from '../components/checkout/CheckoutOrderSummary';
import PlaceOrderBar from '../components/checkout/PlaceOrderBar';
import CouponCard from '../components/cart/CouponCard';

const COD_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 100000;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartTotals, clearCart } = useCart();
  const { fetchOrders } = useOrders();
  const { user } = useAuth();
  const { showToast } = useToast();

  const safeCartItems = cartItems || [];
  const safeCartTotals = cartTotals || { subtotal: 0, originalSubtotal: 0 };

  // Redirect if cart is empty or not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    } else if (safeCartItems.length === 0) {
      navigate('/cart');
    }
  }, [safeCartItems, navigate, user]);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Fetch Addresses on load
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressService.getAddresses();
        const addrs = res.data?.data || [];
        setAddresses(addrs);
        
        if (addrs.length > 0) {
          // If we passed an address from Cart, select it, else select default
          const cartAddrId = location.state?.shippingAddress?._id;
          if (cartAddrId && addrs.some(a => a._id === cartAddrId)) {
            setSelectedAddressId(cartAddrId);
          } else {
            const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
            setSelectedAddressId(defaultAddr._id);
          }
        }
      } catch (err) {
        console.error('Failed to load addresses', err);
      }
    };
    if (user) fetchAddresses();
  }, [user, location.state]);

  const handleSaveAddress = async (newAddr) => {
    try {
      if (newAddr._id) {
        const res = await addressService.updateAddress(newAddr._id, newAddr);
        setAddresses(prev => prev.map(a => a._id === newAddr._id ? res.data.data : a));
      } else {
        const res = await addressService.addAddress(newAddr);
        setAddresses(prev => [...prev, res.data.data]);
        setSelectedAddressId(res.data.data._id);
      }
    } catch (err) {
      console.error('Failed to save address', err);
      showToast('Failed to save address', 'error');
    }
  };

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
  };

  const selectedDeliveryOption = DELIVERY_OPTIONS.find((o) => o.id === deliveryMethod);
  const deliveryCharge = selectedDeliveryOption?.charge ?? 0;

  // Pricing calculations from backend Cart Context
  const subtotal = safeCartTotals.subtotal || 0;
  const originalSubtotal = safeCartTotals.originalSubtotal || 0;
  const baseDeliveryCharge = safeCartTotals.totalDeliveryCharge || 0;

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleCouponApply = async (code) => {
    try {
      const res = await couponService.validateCoupon(code);
      setAppliedCoupon(res.data.data);
      setCouponError('');
      showToast('Coupon applied successfully', 'success');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  let couponDiscount = 0;
  if (appliedCoupon && appliedCoupon.discount) {
    couponDiscount = appliedCoupon.discount;
  }

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentMethodData, setPaymentMethodData] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentErrors({});
  };

  const isFreeShipping = baseDeliveryCharge === 0;
  const codHandlingFee = 0;
  const totalSavings = (originalSubtotal - subtotal) + couponDiscount;
  const total = Math.max(0, subtotal - couponDiscount + baseDeliveryCharge);

  // Payment validation
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

  // Place Order
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select a delivery address', 'error');
      return;
    }

    const errs = validatePayment();
    if (Object.keys(errs).length > 0) { setPaymentErrors(errs); return; }

    setIsLoading(true);

    const orderPayload = {
      addressId: selectedAddressId,
      deliveryMethod: deliveryMethod === 'sameday' ? 'Express' : deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1),
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Razorpay',
      couponCode: appliedCoupon?.code,
    };

    try {
      const res = await ordersService.createOrder(orderPayload);
      const newOrder = res.data.data;

      if (orderPayload.paymentMethod === 'COD') {
        await clearCart();
        await fetchOrders();
        navigate('/order-success', { state: { order: newOrder } });
        return;
      }

      // Initiate Razorpay Payment
      const paymentRes = await paymentService.initiatePayment(newOrder.orderId);
      const intent = paymentRes.data.data;

      const options = {
        key: intent.key,
        amount: intent.amount,
        currency: intent.currency,
        name: 'MobiMart',
        description: `Order #${newOrder.orderId}`,
        order_id: intent.razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: addresses.find(a => a._id === selectedAddressId)?.phone || '',
        },
        theme: {
          color: '#0a0a0a'
        },
        handler: async function (response) {
          try {
            await paymentService.verifyPayment({
              orderId: newOrder.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await clearCart();
            await fetchOrders();
            navigate('/order-success', { state: { order: newOrder } });
          } catch (verifyErr) {
            console.error('Verification failed', verifyErr);
            showToast('Payment verification failed. Check dashboard.', 'error');
            navigate('/dashboard');
          }
        },
        modal: {
          ondismiss: function () {
            showToast('Payment cancelled. You can retry from your dashboard.', 'info');
            navigate('/dashboard');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast(response.error.description || 'Payment failed', 'error');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <CheckoutHeader step={1} />

      <div className="w-full bg-[#FAF9F6] min-h-screen pb-32 px-4 sm:px-6 select-none">
        <div className="max-w-3xl mx-auto pt-6 flex flex-col gap-5">

          <div id="address-section">
            <AddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={(addr) => setSelectedAddressId(addr._id)}
              onEditAddress={(addr) => {
                setEditingAddress(addr);
                setIsAddressModalOpen(true);
              }}
              onAddNew={() => {
                setEditingAddress(null);
                setIsAddressModalOpen(true);
              }}
            />
          </div>

          <DeliveryMethod selected={deliveryMethod} onChange={handleDeliveryChange} />

          <div className="bg-white border border-gray-150/40 rounded-3xl p-5 shadow-soft-ui flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
                Your Items
              </h2>
              <span className="text-[10px] font-bold text-gray-400">
                {safeCartItems.length} {safeCartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {safeCartItems.map((item) => {
                const prod = item?.product || item?.productId;
                if (!prod) return null; // Safeguard against deleted products in cart
                return (
                  <CompactOrderCard
                    key={`${prod._id || prod.id}-${item.selectedStorage}-${item.selectedColor}-${item.selectedRam}`}
                    item={{ ...item, product: prod }}
                  />
                );
              })}
            </div>
          </div>

          <CouponCard
            appliedCoupon={appliedCoupon}
            onApply={handleCouponApply}
            onRemove={removeCoupon}
            error={couponError}
          />

          <PaymentAccordion
            selectedMethod={paymentMethod}
            onMethodChange={handlePaymentMethodChange}
            methodData={paymentMethodData}
            onMethodDataChange={setPaymentMethodData}
            errors={paymentErrors}
          />

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

          <p className="text-[9px] text-gray-400 font-semibold text-center leading-relaxed pb-2">
            By placing this order you agree to MobiMart's{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

        </div>
      </div>

      <PlaceOrderBar
        total={total}
        onPlaceOrder={handlePlaceOrder}
        isLoading={isLoading}
        isDisabled={!selectedAddressId}
      />

      <CheckoutAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        editAddress={editingAddress}
        onSave={handleSaveAddress}
      />
    </MainLayout>
  );
};

export default CheckoutPage;
