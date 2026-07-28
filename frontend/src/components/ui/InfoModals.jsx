import React from 'react';
import { X, ShieldCheck, Award, Truck, CheckCircle2, Sparkles } from 'lucide-react';

/* ==========================================================================
   Base Modal Shell
   ========================================================================== */
export const BaseModal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#FAF9F6] border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 mb-5">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-full bg-gold-bg border border-[#EBDCD0] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#C5A880]" />
              </div>
            )}
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-950">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 bg-white border border-gray-200/60 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="text-left text-xs sm:text-sm text-neutral-700 space-y-4">
          {children}
        </div>

        {/* Action button */}
        <div className="mt-6 pt-4 border-t border-gray-200/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   1. Certification Modal
   ========================================================================== */
export const CertificationModal = ({ isOpen, onClose }) => {
  const checkpoints = [
    '65+ Point Hardware & Diagnostics Inspection',
    'Original Battery Health Check (>85% guaranteed)',
    'Full Display, Touch & TrueTone Screen Testing',
    'Camera Lenses & Optical Stabilization Check',
    'Microphone, Speakers & Audio Clarity Audit',
    'IMEI Verification & Clean Carrier Security Record',
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Certified Device Standard" icon={ShieldCheck}>
      <p className="font-medium leading-relaxed text-gray-600">
        Every pre-owned and refurbished smartphone at MobiMart undergoes an exhaustive 65-point laboratory inspection conducted by certified engineers.
      </p>

      <div className="space-y-2.5 py-2">
        {checkpoints.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-gray-150/60 shadow-xs">
            <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
            <span className="font-bold text-xs text-neutral-900">{item}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-500 font-semibold italic">
        * Certified devices include original charging cables and verified grading reports.
      </p>
    </BaseModal>
  );
};

/* ==========================================================================
   2. Warranty Modal
   ========================================================================== */
export const WarrantyModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="12 Months Warranty Coverage" icon={Award}>
      <p className="font-medium leading-relaxed text-gray-600">
        MobiMart backs every certified device with an industry-leading complimentary 12-month doorstep warranty for complete peace of mind.
      </p>

      <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-150/60 shadow-xs">
        <h4 className="font-extrabold text-neutral-950 text-xs uppercase tracking-wider">What is covered:</h4>
        <ul className="space-y-1.5 text-xs font-semibold text-neutral-800 list-disc list-inside">
          <li>Internal hardware malfunction & motherboard failure</li>
          <li>Touchscreen responsiveness & display panel defect</li>
          <li>Battery health drops below 80% during warranty period</li>
          <li>Camera module, speaker, and microphone defects</li>
        </ul>
      </div>

      <div className="bg-amber-50/80 border border-amber-200/60 p-3 rounded-xl">
        <p className="text-[11px] font-bold text-amber-900">
          Doorstep Pick-Up & Repair: We pick up your device directly from your address and return it repaired within 48-72 hours.
        </p>
      </div>
    </BaseModal>
  );
};

/* ==========================================================================
   3. Shipping Policy Modal
   ========================================================================== */
export const ShippingPolicyModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Free Express Shipping" icon={Truck}>
      <p className="font-medium leading-relaxed text-gray-600">
        All orders over ₹1,00,000 qualify for free express shipping across India. Standard orders ship via trusted insured logistics partners.
      </p>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-white p-3 rounded-2xl border border-gray-150/60">
          <span className="text-xs font-extrabold text-neutral-950 block">Metro Cities</span>
          <span className="text-xs font-bold text-[#C5A880] block mt-0.5">24 - 48 Hours</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-gray-150/60">
          <span className="text-xs font-extrabold text-neutral-950 block">Rest of India</span>
          <span className="text-xs font-bold text-[#C5A880] block mt-0.5">2 - 4 Business Days</span>
        </div>
      </div>

      <div className="space-y-2 text-xs font-semibold text-neutral-800">
        <p>✓ 100% Insured Delivery — Zero risk for damage during transit.</p>
        <p>✓ Real-Time SMS & WhatsApp Live Tracking Link on dispatch.</p>
      </div>
    </BaseModal>
  );
};

/* ==========================================================================
   4. Why Choose Modal
   ========================================================================== */
export const WhyChooseModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Why Choose MobiMart" icon={Sparkles}>
      <p className="font-medium leading-relaxed text-gray-600">
        MobiMart is India's premier destination for authenticated luxury smartphones and certified pre-owned devices.
      </p>

      <div className="space-y-3">
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150/60">
          <h4 className="font-extrabold text-neutral-950 text-xs">Unmatched Quality Assurance</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">Every phone is tested against 65+ benchmarks by expert technicians.</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150/60">
          <h4 className="font-extrabold text-neutral-950 text-xs">7-Day Money-Back Guarantee</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">Not satisfied with your device? Return it within 7 days for a hassle-free refund.</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-gray-150/60">
          <h4 className="font-extrabold text-neutral-950 text-xs">Dedicated Customer Support</h4>
          <p className="text-xs text-gray-500 font-medium mt-1">24/7 helpline, WhatsApp chat, and doorstep warranty resolution.</p>
        </div>
      </div>
    </BaseModal>
  );
};
