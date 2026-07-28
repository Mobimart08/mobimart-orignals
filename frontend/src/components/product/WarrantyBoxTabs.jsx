import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  HelpCircle, 
  HelpCircle as MapPin, 
  ChevronRight, 
  Smartphone, 
  Cable, 
  FileText 
} from 'lucide-react';

/* ==========================================================================
   WarrantyBoxTabs Component
   - Tab switcher for Warranty and What's in the Box sections (Slice 3)
   - Warranty: Renders a dark, gold-accented warranty summary card
   - In the Box: Lists the contents included in the package inside clean cards
   ========================================================================== */

export const WarrantyBoxTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('Warranty');

  const tabs = ['Warranty', 'In the Box'];

  // Map package items to Lucide icons
  const getIconForBoxItem = (name) => {
    const n = name.toLowerCase();
    if (n.includes('phone') || n.includes('pixel') || n.includes('s24')) {
      return <Smartphone size={16} className="text-neutral-700" />;
    }
    if (n.includes('cable') || n.includes('usb')) {
      return <Cable size={16} className="text-neutral-700" />;
    }
    if (n.includes('documentation') || n.includes('paper')) {
      return <FileText size={16} className="text-neutral-700" />;
    }
    return <Smartphone size={16} className="text-neutral-700" />;
  };

  return (
    <div className="w-full text-left select-none bg-white p-5 rounded-3xl border border-gray-150/40 shadow-soft-ui flex flex-col gap-4">
      
      {/* 1. Tab headers */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-neutral-900 text-neutral-950 font-black'
                  : 'border-transparent text-gray-400 hover:text-neutral-700'
              }`}
              aria-label={`Show ${tab} section`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 2. Active Tab Render */}
      <div className="min-h-[220px]">
        {/* PANEL A: Warranty Details */}
        {activeTab === 'Warranty' && (
          <div className="bg-[#0B0B0C] text-white rounded-2xl p-6 border border-neutral-900 flex flex-col gap-5 animate-fade-in relative overflow-hidden">
            {/* Top gold check badge */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-neutral-900 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shadow-md shrink-0">
                <ShieldCheck size={22} className="text-[#C5A880]" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#C5A880]">
                  {product.warranty || '12 Months Warranty'}
                </h4>
                <p className="text-[9.5px] sm:text-[10.5px] text-neutral-400 font-bold leading-normal mt-0.5 max-w-[240px]">
                  Comprehensive coverage against manufacturing defects and technical issues.
                </p>
              </div>
            </div>

            {/* Coverage points list */}
            <div className="flex flex-col gap-3.5 border-t border-neutral-900/60 pt-4">
              {/* Coverage Item 1 */}
              <div className="flex items-center gap-3 text-[10.5px] font-bold text-neutral-200">
                <Wrench size={14} className="text-[#C5A880]" />
                <span>Coverage for Hardware Issues</span>
              </div>
              {/* Coverage Item 2 */}
              <div className="flex items-center gap-3 text-[10.5px] font-bold text-neutral-200">
                <ShieldCheck size={14} className="text-[#C5A880]" />
                <span>Free Repair or Replacement</span>
              </div>
              {/* Coverage Item 3 */}
              <div className="flex items-center gap-3 text-[10.5px] font-bold text-neutral-200">
                <MapPin size={14} className="text-[#C5A880]" />
                <span>PAN India Service Support</span>
              </div>
            </div>

            {/* Learn More link */}
            <button
              type="button"
              onClick={() => alert('Detailed Warranty Terms document simulated!')}
              className="text-[#C5A880] hover:text-[#B59972] text-[10.5px] font-bold flex items-center gap-0.5 self-start cursor-pointer transition-colors"
            >
              <span>Learn More</span>
              <ChevronRight size={13} strokeWidth={2.4} />
            </button>
          </div>
        )}

        {/* PANEL B: In the Box items list */}
        {activeTab === 'In the Box' && (
          <div className="flex flex-col gap-3 animate-fade-in text-left">
            <h4 className="text-[12.5px] font-extrabold text-neutral-950 uppercase tracking-wider mb-1">
              What's in the Box
            </h4>
            {product.boxContents && product.boxContents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {product.boxContents.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3.5 p-3.5 border border-gray-150/40 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-gray-200/40 flex items-center justify-center shrink-0 shadow-sm">
                      {getIconForBoxItem(item)}
                    </div>
                    <span className="text-[11.5px] sm:text-xs font-extrabold text-neutral-950">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-bold py-6">No box package data mapped.</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default WarrantyBoxTabs;
