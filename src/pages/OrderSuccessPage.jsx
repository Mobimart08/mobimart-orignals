import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Truck, Package, ArrowRight, MapPin } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

/* ==========================================================================
   OrderSuccessPage
   - Final confirmation screen after a successful (dummy) order placement
   - Reads last order data from localStorage
   - Cart is already cleared by CheckoutPage before navigation
   ========================================================================== */

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    // Read order data saved by CheckoutPage
    const raw = localStorage.getItem('mobimart_last_order');
    if (raw) setOrder(JSON.parse(raw));

    // Trigger success check animation after mount
    const timer = setTimeout(() => setCheckVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fmt = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  // Estimate delivery: 3 business days from today
  const estimatedDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <MainLayout>
      <div className="w-full min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-start px-4 py-10 sm:py-16">
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          {/* ── SUCCESS ANIMATION BADGE ──────────────────────────────────── */}
          <div className={`transition-all duration-700 ease-out ${
            checkVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <div className="relative">
              {/* Outer glow ring */}
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-18 h-18 rounded-full bg-green-200/60 flex items-center justify-center w-16 h-16">
                  <CheckCircle2 size={44} className="text-green-600" strokeWidth={1.8} />
                </div>
              </div>
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-30" />
            </div>
          </div>

          {/* ── TITLE ────────────────────────────────────────────────────── */}
          <div className={`text-center transition-all duration-500 delay-200 ${
            checkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 mb-1">Order Confirmed! 🎉</h1>
            <p className="text-xs text-gray-400 font-semibold">
              Your MobiMart order has been placed successfully.
            </p>
          </div>

          {/* ── ORDER ID CARD ─────────────────────────────────────────────── */}
          {order && (
            <div className={`w-full transition-all duration-500 delay-300 ${
              checkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-soft-ui flex flex-col gap-4">

                {/* Order ID row */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-black text-neutral-950 font-mono tracking-wide">{order.orderId}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[9px] font-black rounded-full border border-green-100 uppercase tracking-wider">
                    Confirmed
                  </span>
                </div>

                {/* Delivery estimate */}
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    <Truck size={16} className="text-neutral-600" strokeWidth={2.2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Estimated Delivery</span>
                    <span className="text-xs font-black text-green-600">{estimatedDate()}</span>
                  </div>
                </div>

                {/* Address row */}
                {order.address && (
                  <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin size={15} className="text-[#C5A880]" strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Delivering To</span>
                      <span className="text-xs font-black text-neutral-950">{order.address.name}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">
                        {order.address.address && `${order.address.address}, `}
                        {order.address.city}, {order.address.state} - {order.address.pin}
                        {order.address.line1 && !order.address.address && `${order.address.line1}, ${order.address.line2}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Items summary */}
                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    <Package size={15} className="text-neutral-600" strokeWidth={2.2} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wide">Items</span>
                    <span className="text-xs font-bold text-neutral-800">
                      {order.items?.map((i) => `${i.name} (${i.storage})`).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Amount paid */}
                <div className="flex items-center justify-between bg-neutral-950 text-white rounded-2xl px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-widest">Amount Paid</span>
                  <span className="text-sm font-black">{fmt(order.total)}</span>
                </div>

              </div>
            </div>
          )}

          {/* ── CTA BUTTONS ──────────────────────────────────────────────── */}
          <div className={`w-full flex flex-col gap-3 transition-all duration-500 delay-400 ${
            checkVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Track Order (dummy) */}
            <button
              type="button"
              className="w-full py-3.5 text-xs font-black text-neutral-950 bg-white border-2 border-neutral-150 hover:border-neutral-400 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
              onClick={() => {}} // dummy
            >
              <Truck size={13} /> Track My Order
            </button>

            {/* Continue Shopping */}
            <button
              type="button"
              onClick={() => navigate('/store')}
              className="w-full py-3.5 text-xs font-black text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Micro trust note */}
          <p className="text-[9px] text-gray-400 font-semibold text-center">
            A confirmation will be sent to your registered contact. 
            For queries, contact{' '}
            <span className="underline cursor-pointer">support@mobimart.in</span>
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccessPage;
