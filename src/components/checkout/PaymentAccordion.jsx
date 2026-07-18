import React, { useState } from 'react';
import { Smartphone, CreditCard, Landmark, Wallet, Banknote, ChevronDown, Lock } from 'lucide-react';
import UPIPayment from './UPIPayment';
import CardPayment from './CardPayment';
import NetBankingPayment from './NetBankingPayment';
import WalletPayment from './WalletPayment';
import CODPayment from './CODPayment';

/* ==========================================================================
   PaymentAccordion Component
   - Single-open accordion with 6 payment mode sections
   - Smooth max-height CSS transition (no framer motion / GSAP)
   - Manages sub-section state internally; exposes selectedMethod + methodData up
   ========================================================================== */

const PAYMENT_METHODS = [
  { id: 'upi',       label: 'UPI',            icon: Smartphone,  subtitle: 'GPay, PhonePe, Paytm, BHIM' },
  { id: 'credit',    label: 'Credit Card',    icon: CreditCard,  subtitle: 'Visa, Mastercard, RuPay' },
  { id: 'debit',     label: 'Debit Card',     icon: CreditCard,  subtitle: 'All major banks' },
  { id: 'netbanking',label: 'Net Banking',    icon: Landmark,    subtitle: 'HDFC, ICICI, SBI + more' },
  { id: 'wallet',    label: 'Wallet',         icon: Wallet,      subtitle: 'Amazon Pay, MobiKwik' },
  { id: 'cod',       label: 'Cash on Delivery',icon: Banknote,  subtitle: '₹49 handling fee applies' },
];

export const PaymentAccordion = ({ selectedMethod, onMethodChange, methodData, onMethodDataChange, errors = {} }) => {
  const [openPanel, setOpenPanel] = useState(selectedMethod || 'upi');

  const handleHeaderClick = (id) => {
    const next = openPanel === id ? null : id;
    setOpenPanel(next);
    if (next) onMethodChange(next);
  };

  const renderContent = (id) => {
    switch (id) {
      case 'upi':
        return (
          <UPIPayment
            value={methodData?.upiId || ''}
            onChange={(v) => onMethodDataChange({ ...methodData, upiId: v })}
            error={errors.upiId}
          />
        );
      case 'credit':
      case 'debit':
        return (
          <CardPayment
            cardData={methodData?.card || {}}
            onChange={(v) => onMethodDataChange({ ...methodData, card: v })}
            errors={errors.card}
          />
        );
      case 'netbanking':
        return (
          <NetBankingPayment
            value={methodData?.bank || ''}
            onChange={(v) => onMethodDataChange({ ...methodData, bank: v })}
            error={errors.bank}
          />
        );
      case 'wallet':
        return (
          <WalletPayment
            value={methodData?.wallet || ''}
            onChange={(v) => onMethodDataChange({ ...methodData, wallet: v })}
          />
        );
      case 'cod':
        return <CODPayment />;
      default:
        return null;
    }
  };

  return (
    <div className="checkout-card flex flex-col gap-0">
      {/* Section title */}
      <div className="flex items-center gap-1.5 mb-4">
        <Lock size={15} className="text-[#C5A880]" />
        <h2 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">Payment Method</h2>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 border border-neutral-100 rounded-2xl overflow-hidden">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isOpen = openPanel === method.id;
          const isSelected = selectedMethod === method.id;

          return (
            <div key={method.id} className={`transition-colors ${isOpen ? 'bg-neutral-950/[0.02]' : 'bg-white'}`}>
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => handleHeaderClick(method.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
              >
                {/* Custom radio indicator */}
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                {/* Method icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isOpen ? 'bg-neutral-950' : 'bg-neutral-100'
                }`}>
                  <Icon size={14} className={isOpen ? 'text-white' : 'text-neutral-500'} strokeWidth={2.2} />
                </div>

                {/* Label + subtitle */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-black text-neutral-950">{method.label}</span>
                  <span className="text-[9px] text-gray-400 font-semibold">{method.subtitle}</span>
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.5}
                />
              </button>

              {/* Accordion body — CSS height transition */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4">
                  {renderContent(method.id)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentAccordion;
