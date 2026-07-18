import React from 'react';
import { MessageSquare, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import Card from '../ui/Card';

/* ==========================================================================
   SupportGrid Component
   - Displays 5 clickable support touchpoints
   - Standard mock handlers (alert logs) simulating live support chat launches
   ========================================================================== */

export const SupportGrid = () => {
  const supports = [
    { id: 'chat',  label: 'Live Chat',   icon: MessageSquare, color: '#C5A880', action: () => alert('Initiating premium live chat with support agent...') },
    { id: 'wa',    label: 'WhatsApp',    icon: MessageCircle, color: '#25D366', action: () => alert('Launching WhatsApp support chat window...') },
    { id: 'email', label: 'Email Us',    icon: Mail,          color: '#EA4335', action: () => alert('Opening default mail client to support@mobimart.in...') },
    { id: 'call',  label: 'Call Us',     icon: Phone,         color: '#34A853', action: () => alert('Initiating toll-free call connection to 1800-MOBI-MART...') },
    { id: 'faq',   label: 'FAQ Center',  icon: HelpCircle,    color: '#002970', action: () => alert('Redirecting to MobiMart Help Center & Knowledge Base...') }
  ];

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider border-b border-gray-100 pb-2">
        Customer Support
      </h3>

      {/* Grid container */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {supports.map((sup) => {
          const Icon = sup.icon;
          return (
            <Card
              key={sup.id}
              variant="custom"
              onClick={sup.action}
              className="bg-white border border-gray-150/40 hover:border-[#C5A880]/30 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2.5 transition-all hover:shadow-soft-ui cursor-pointer active:scale-[0.97] min-h-[90px]"
            >
              {/* Icon circle */}
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${sup.color}15` }}
              >
                <Icon size={14} style={{ color: sup.color }} strokeWidth={2.4} />
              </div>

              {/* Label */}
              <span className="text-[10px] sm:text-xs font-black text-neutral-900 leading-none">
                {sup.label}
              </span>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default SupportGrid;
