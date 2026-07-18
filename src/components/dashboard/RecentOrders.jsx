import React, { useState } from 'react';
import { ShoppingBag, Eye, Truck, RefreshCw, CheckCircle, Package, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

/* ==========================================================================
   RecentOrders Component
   - Renders a list of orders placed by the user
   - Custom status styling: Pending, Packed, Shipped, Delivered, Cancelled
   - Actions: View Details (collapsible), Track Order, Buy Again (re-adds to cart)
   ========================================================================== */

const STATUS_STYLING = {
  Pending:   { text: 'Pending',   bg: 'bg-amber-50 text-amber-600 border-amber-200/50' },
  Packed:    { text: 'Packed',    bg: 'bg-blue-50 text-blue-600 border-blue-200/50' },
  Shipped:   { text: 'Shipped',   bg: 'bg-cyan-50 text-cyan-600 border-cyan-200/50' },
  Delivered: { text: 'Delivered', bg: 'bg-green-50 text-green-600 border-green-250/30' },
  Cancelled: { text: 'Cancelled', bg: 'bg-red-50 text-red-500 border-red-200/50' },
};

export const RecentOrders = ({ orders = [], onAddToast }) => {
  const { addToCart } = useCart();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleBuyAgain = (ord) => {
    addToCart(ord.product, ord.selectedStorage, ord.selectedColor, 1);
    if (onAddToast) {
      onAddToast(`${ord.product.name} re-added to cart!`);
    } else {
      alert(`${ord.product.name} re-added to cart!`);
    }
  };

  const toggleDetails = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
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
          const style = STATUS_STYLING[ord.status] || STATUS_STYLING.Pending;
          const isExpanded = expandedOrder === ord.orderId;
          const priceNum = ord.total || parseInt(ord.product.price.replace(/[^\d]/g, ''), 10);
          const formattedTotal = `₹${priceNum.toLocaleString('en-IN')}`;

          return (
            <div 
              key={ord.orderId}
              className="bg-white border border-gray-150/40 rounded-3xl p-4 sm:p-5 shadow-soft-ui flex flex-col gap-4 transition-all"
            >
              {/* Row 1: Header Specs */}
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
                    {ord.purchaseDate}
                  </span>
                </div>
                
                {/* Status Badge */}
                <span className={`px-2.5 py-0.5 text-[8.5px] font-black rounded-full uppercase tracking-wider border ${style.bg}`}>
                  {style.text}
                </span>
              </div>

              {/* Row 2: Product details summary */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-[#FAF9F6] rounded-xl flex items-center justify-center shrink-0 border border-gray-100 p-1 overflow-hidden">
                  <img
                    src={ord.product.image}
                    alt={ord.product.name}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 block">
                    {ord.product.brand}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950 truncate leading-tight">
                    {ord.product.name}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {ord.selectedStorage} · {ord.selectedColor} · Qty {ord.quantity}
                  </p>
                </div>
                
                {/* Total Paid price */}
                <div className="text-right shrink-0 flex flex-col justify-center">
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider leading-none mb-1 block">
                    Paid
                  </span>
                  <span className="text-xs sm:text-sm font-black text-neutral-950 block">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              {/* Collapsible details layout */}
              {isExpanded && (
                <div className="bg-[#FAF9F6] border border-neutral-100 rounded-2xl p-3.5 flex flex-col gap-2.5 text-xs text-neutral-700 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-gray-200/50 pb-1.5 font-bold text-neutral-950 text-[10px] uppercase tracking-wider">
                    <span>Shipping Details</span>
                    <span>Invoice Summary</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-neutral-950 font-black">Method: {ord.deliveryMethod === 'express' ? 'Express Courier' : 'Standard Delivery'}</span>
                      <span>Estimated Duration: 3-5 Business Days</span>
                      <span>Payment: {ord.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span>Device price: {ord.product.price}</span>
                      <span>GST (18% Incl.): Included</span>
                      <span className="font-black text-neutral-950 mt-1 pt-1 border-t border-gray-200/50">Total Paid: {formattedTotal}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 3: Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {/* Details toggle */}
                <button
                  type="button"
                  onClick={() => toggleDetails(ord.orderId)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-neutral-200 hover:border-neutral-900 rounded-full text-[10.5px] font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  <Eye size={12} strokeWidth={2.4} />
                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                </button>

                {/* Track Order (Dummy prompt or status update) */}
                <button
                  type="button"
                  onClick={() => {
                    alert(`Tracking ID for Order #${ord.orderId} is MMTRK-${ord.orderId}. Shipped via Bluedart.`);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-neutral-200 hover:border-neutral-900 rounded-full text-[10.5px] font-bold text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  <Truck size={12} strokeWidth={2.4} />
                  <span>Track Order</span>
                </button>

                {/* Repeat purchase / Buy Again */}
                <button
                  type="button"
                  onClick={() => handleBuyAgain(ord)}
                  className="flex-grow sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 bg-neutral-950 hover:bg-neutral-800 rounded-full text-[10.5px] font-bold text-white transition-all cursor-pointer shadow-sm ml-auto active:scale-[0.98]"
                >
                  <RefreshCw size={11} strokeWidth={2.4} />
                  <span>Buy Again</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrders;
