import React, { useState } from 'react';
import { ShoppingBag, Eye, Truck, RefreshCw, XCircle, X, CheckCircle, Clock, Package, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService, ordersService } from '../../api/services';

const STATUS_STYLING = {
  Pending:   { text: 'Pending',   bg: 'bg-amber-50 text-amber-600 border-amber-200/50' },
  Processing:{ text: 'Processing',bg: 'bg-blue-50 text-blue-600 border-blue-200/50' },
  Shipped:   { text: 'Shipped',   bg: 'bg-cyan-50 text-cyan-600 border-cyan-200/50' },
  Delivered: { text: 'Delivered', bg: 'bg-green-50 text-green-600 border-green-250/30' },
  Cancelled: { text: 'Cancelled', bg: 'bg-red-50 text-red-500 border-red-200/50' },
};

export const RecentOrders = ({ orders = [], onAddToast }) => {
  const { addToCart } = useCart();
  const { fetchOrders } = useOrders();
  const { showToast } = useToast();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const handleBuyAgain = (ord) => {
    if (ord.items && ord.items.length > 0) {
      const item = ord.items[0];
      // Note: item.productId could be string or object depending on population. Assuming it works with addToCart.
      addToCart({ _id: item.productId, id: item.productId, name: item.name }, item.selectedStorage, item.selectedColor, 1);
      if (onAddToast) {
        onAddToast(`${item.name} re-added to cart!`);
      } else {
        showToast(`${item.name} re-added to cart!`, 'success');
      }
    }
  };

  const handleTrackOrder = (ord) => {
    setTrackingOrder(ord);
  };

  const toggleDetails = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      await ordersService.cancelOrder(orderId);
      showToast(`Order #${orderId} cancelled successfully`, 'success');
      fetchOrders();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancellingOrder(null);
    }
  };

  const { user } = useAuth();
  
  const handleRetryPayment = async (ord) => {
    try {
      const paymentRes = await paymentService.initiatePayment(ord.orderId);
      const intent = paymentRes.data.data;

      const options = {
        key: intent.key,
        amount: intent.amount,
        currency: intent.currency,
        name: 'MobiMart',
        description: `Order #${ord.orderId}`,
        order_id: intent.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: ord.shippingAddress?.phone,
        },
        theme: {
          color: '#0a0a0a'
        },
        handler: async function (response) {
          try {
            await paymentService.verifyPayment({
              orderId: ord.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            showToast('Payment successful!', 'success');
            fetchOrders();
          } catch (verifyErr) {
            console.error('Verification failed', verifyErr);
            showToast('Payment verification failed.', 'error');
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
      showToast('Failed to initialize payment', 'error');
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-150/40 rounded-3xl p-8 text-center shadow-soft-ui select-none">
        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag size={18} strokeWidth={2.2} />
        </div>
        <h4 className="text-sm font-extrabold text-neutral-950 mb-1">No Orders Yet</h4>
        <p className="text-[10.5px] text-gray-400 font-bold max-w-xs mx-auto">
          Explore our certified store collections and place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 select-none text-left">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
        Recent Orders
      </h3>

      <div className="flex flex-col gap-3.5">
        {orders.map((ord) => {
          const style = STATUS_STYLING[ord.orderStatus] || STATUS_STYLING.Pending;
          const isExpanded = expandedOrder === ord.orderId;
          const formattedTotal = `₹${(ord.pricing?.total || 0).toLocaleString('en-IN')}`;
          
          const purchaseDate = new Date(ord.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          });

          // Display first item in UI for summary
          const mainItem = ord.items[0];

          return (
            <div 
              key={ord.orderId}
              className="bg-white border border-gray-150/40 rounded-3xl p-4 sm:p-5 shadow-soft-ui flex flex-col gap-4 transition-all"
            >
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
                    Order Number
                  </span>
                  <span className="text-xs font-black text-neutral-950 font-mono">
                    #{ord.orderId}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1">
                    Purchase Date
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {purchaseDate}
                  </span>
                </div>
                
                <span className={`px-2.5 py-0.5 text-[8.5px] font-black rounded-full uppercase tracking-wider border ${style.bg}`}>
                  {style.text}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#FAF9F6] rounded-xl flex items-center justify-center shrink-0 border border-gray-100 p-1 overflow-hidden">
                  <ShoppingBag size={24} className="text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 block">
                    {ord.items.length} {ord.items.length === 1 ? 'Item' : 'Items'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950 truncate leading-tight">
                    {mainItem?.name} {ord.items.length > 1 && `+ ${ord.items.length - 1} more`}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {mainItem?.selectedStorage} · {mainItem?.selectedColor} · Qty {mainItem?.quantity}
                  </p>
                </div>
                
                <div className="text-right shrink-0 flex flex-col justify-center">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1 block">
                    Total
                  </span>
                  <span className="text-xs sm:text-sm font-black text-neutral-950 block">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-[#FAF9F6] border border-neutral-100 rounded-2xl p-3.5 flex flex-col gap-2.5 text-xs text-neutral-700 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-gray-200/50 pb-1.5 font-bold text-neutral-950 text-[10px] uppercase tracking-wider">
                    <span>Shipping Details</span>
                    <span>Invoice Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-neutral-950 font-black">Method: {ord.deliveryMethod === 'Express' ? 'Express Courier' : 'Standard Delivery'}</span>
                      <span>Address: {ord.shippingAddress?.addressLine1}</span>
                      <span>Payment: {ord.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span>Subtotal: ₹{ord.pricing?.subtotal?.toLocaleString('en-IN')}</span>
                      <span>Discount: -₹{ord.pricing?.discount?.toLocaleString('en-IN')}</span>
                      <span>Shipping: ₹{ord.pricing?.shipping?.toLocaleString('en-IN')}</span>
                      <span className="font-black text-neutral-950 mt-1 pt-1 border-t border-gray-200/50">Total Paid: {formattedTotal}</span>
                    </div>
                  </div>
                  {/* Cancel Button if eligible */}
                  {(ord.orderStatus === 'Pending' || ord.orderStatus === 'Processing') && (
                    <div className="mt-2 pt-2 border-t border-gray-200/50 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(ord.orderId)}
                        disabled={cancellingOrder === ord.orderId}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50"
                      >
                        <XCircle size={12} />
                        {cancellingOrder === ord.orderId ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => toggleDetails(ord.orderId)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-neutral-200 hover:border-neutral-900 rounded-full text-[10.5px] font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  <Eye size={12} strokeWidth={2.4} />
                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTrackOrder(ord)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-neutral-200 hover:border-neutral-900 rounded-full text-[10.5px] font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  <Truck size={12} strokeWidth={2.4} />
                  <span>Track Order</span>
                </button>

                {ord.paymentMethod === 'Razorpay' && ord.paymentStatus === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => handleRetryPayment(ord)}
                    className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-[10.5px] font-bold text-white transition-all cursor-pointer shadow-sm ml-auto active:scale-[0.98]"
                  >
                    <span>Pay Now</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleBuyAgain(ord)}
                  className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-neutral-950 hover:bg-neutral-800 rounded-full text-[10.5px] font-bold text-white transition-all cursor-pointer shadow-sm ml-2 active:scale-[0.98]"
                >
                  <RefreshCw size={11} strokeWidth={2.4} />
                  <span>Buy Again</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal 
          order={trackingOrder} 
          onClose={() => setTrackingOrder(null)} 
        />
      )}
    </div>
  );
};

const OrderTrackingModal = ({ order, onClose }) => {
  const steps = [
    { label: 'Pending', icon: <Clock size={16} /> },
    { label: 'Processing', icon: <Package size={16} /> },
    { label: 'Shipped', icon: <Truck size={16} /> },
    { label: 'Delivered', icon: <CheckCircle size={16} /> },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="p-5 sm:p-6 text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
                Track Order
              </h3>
              <p className="text-[10.5px] font-mono text-gray-500 mt-1">
                #{order.orderId}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-gray-500 hover:text-neutral-900 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {isCancelled ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} />
              </div>
              <h4 className="text-sm font-bold text-neutral-950 mb-1">Order Cancelled</h4>
              <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                This order was cancelled. If you have been charged, a refund will be processed within 5-7 business days.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 py-2">
              {/* Vertical timeline line */}
              <div className="absolute top-2 bottom-6 left-[31px] w-0.5 bg-gray-100"></div>
              
              <div className="flex flex-col gap-6 relative z-10">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div key={step.label} className={`flex items-start gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                        isCompleted ? 'bg-[#C5A880] text-white border-[#C5A880]' : 'bg-white text-gray-400 border-gray-200'
                      } ${isCurrent ? 'ring-4 ring-gold-accent/20' : ''}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-neutral-950' : 'text-gray-500'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && index === 2 && order.trackingNumber && (
                          <p className="text-[10px] text-gray-500 font-bold mt-1 bg-gray-50 px-2 py-1 rounded inline-block">
                            Tracking ID: {order.trackingNumber}
                          </p>
                        )}
                        {isCurrent && index === 0 && (
                          <p className="text-[10.5px] text-gray-500 mt-1 leading-relaxed">
                            We have received your order and will begin processing it shortly.
                          </p>
                        )}
                        {isCurrent && index === 1 && (
                          <p className="text-[10.5px] text-gray-500 mt-1 leading-relaxed">
                            Your items are being carefully packed at our fulfillment center.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 text-left">
            <h5 className="text-[10px] font-black text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={12} /> Delivery Address
            </h5>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-gray-100">
              {order.shippingAddress?.name} ({order.shippingAddress?.phone})<br/>
              {order.shippingAddress?.addressLine1}
              {order.shippingAddress?.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              {order.shippingAddress?.landmark && `, Near ${order.shippingAddress.landmark}`}
              <br/>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              <br/>
              {order.shippingAddress?.country || 'India'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
