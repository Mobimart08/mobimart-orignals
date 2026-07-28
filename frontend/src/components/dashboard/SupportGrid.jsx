import React from 'react';
import { MessageSquare, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import Card from '../ui/Card';
import { useToast } from '../../context/ToastContext';

export const SupportGrid = () => {
  const { showToast } = useToast();

  const supports = [
    { id: 'chat',  label: 'Live Chat',   icon: MessageSquare, color: '#C5A880', action: () => showToast('Initiating live chat support...', 'info') },
    { id: 'wa',    label: 'WhatsApp',    icon: MessageCircle, color: '#25D366', action: () => showToast('Connecting to WhatsApp support (+91 98765 43210)...', 'info') },
    { id: 'email', label: 'Email Us',    icon: Mail,          color: '#EA4335', action: () => showToast('Opening mail composer to support@mobimart.in', 'info') },
    { id: 'call',  label: 'Call Us',     icon: Phone,         color: '#34A853', action: () => showToast('Calling toll-free 1800-MOBI-MART...', 'info') },
    { id: 'faq',   label: 'FAQ Center',  icon: HelpCircle,    color: '#002970', action: () => showToast('Redirecting to MobiMart Knowledge Base', 'info') }
  ];

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider border-b border-gray-100 pb-2">
        Customer Support
      </h3>

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
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${sup.color}15` }}
              >
                <Icon size={14} style={{ color: sup.color }} strokeWidth={2.4} />
              </div>

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
