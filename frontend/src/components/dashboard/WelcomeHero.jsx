import React from 'react';
import { Award, ShoppingBag, PiggyBank, Heart } from 'lucide-react';

/* ==========================================================================
   WelcomeHero Component
   - Renders a greeting hero banner for the dashboard
   - Left: Greeting text, member badge, and account description
   - Right: Stat overview cards (Active Orders, Savings, Wishlist)
   ========================================================================== */

export const WelcomeHero = ({ userName = 'Hitansh', ordersCount = 0, wishlistCount = 0, totalSavings = 12500 }) => {
  const formatVal = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="w-full select-none bg-gradient-to-br from-[#F5EFEA]/80 to-[#FAF9F6]/20 border border-[#C5A880]/15 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-soft-ui relative overflow-hidden">
      
      {/* Decorative background vectors */}
      <div className="absolute right-0 bottom-0 w-44 h-44 bg-gradient-to-tr from-[#C5A880]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Left: Message Greeting */}
      <div className="flex-1 text-left relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#C5A880]/20 text-[#C5A880] text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-wider mb-3">
          <Award size={11} strokeWidth={2.5} />
          <span>Gold Member</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-950 tracking-tight leading-tight mb-2">
          Hello, {userName} 👋 <br />
          Welcome back to MobiMart.
        </h2>
        
        <p className="text-xs text-gray-500 font-semibold max-w-sm leading-relaxed">
          Manage your certified device orders, addresses, and payment profiles from one premium space.
        </p>
      </div>

      {/* Right: Summary Stat Grid */}
      <div className="w-full md:w-auto grid grid-cols-3 md:flex md:items-center gap-2.5 sm:gap-3 shrink-0 relative z-10">
        {/* Stat 1: Orders */}
        <div className="bg-white border border-gray-150/40 rounded-2xl p-3 sm:p-4 min-w-[90px] sm:min-w-[110px] text-left shadow-sm flex flex-col justify-between">
          <div className="w-7 h-7 rounded-xl bg-neutral-50 flex items-center justify-center mb-3">
            <ShoppingBag size={13} className="text-[#C5A880]" strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[18px] sm:text-[22px] font-black text-neutral-950 leading-none block">
              {ordersCount}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
              Orders
            </span>
          </div>
        </div>

        {/* Stat 2: Savings */}
        <div className="bg-white border border-gray-150/40 rounded-2xl p-3 sm:p-4 min-w-[90px] sm:min-w-[110px] text-left shadow-sm flex flex-col justify-between">
          <div className="w-7 h-7 rounded-xl bg-neutral-50 flex items-center justify-center mb-3">
            <PiggyBank size={13} className="text-[#C5A880]" strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[18px] sm:text-[22px] font-black text-neutral-950 leading-none block">
              {formatVal(totalSavings)}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
              Savings
            </span>
          </div>
        </div>

        {/* Stat 3: Wishlist */}
        <div className="bg-white border border-gray-150/40 rounded-2xl p-3 sm:p-4 min-w-[90px] sm:min-w-[110px] text-left shadow-sm flex flex-col justify-between">
          <div className="w-7 h-7 rounded-xl bg-neutral-50 flex items-center justify-center mb-3">
            <Heart size={13} className="text-red-400" strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[18px] sm:text-[22px] font-black text-neutral-950 leading-none block">
              {wishlistCount}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
              Wishlist
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WelcomeHero;
