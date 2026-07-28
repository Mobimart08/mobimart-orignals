import React from 'react';
import { ShoppingBag, MapPin, Bell, User2, MessageSquare, Settings } from 'lucide-react';
import Card from '../ui/Card';

/* ==========================================================================
   QuickActions Component
   - Renders 3x2 responsive navigation actions grid
   - Clicking a card triggers the onSelect callback to smooth-scroll
   ========================================================================== */

export const QuickActions = ({ onSelect }) => {
  const actions = [
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, desc: 'View order history' },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, desc: 'Manage delivery hubs' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Recent order updates' },
    { id: 'support', label: 'Support & FAQs', icon: MessageSquare, desc: 'Connect with support' },
    { id: 'profile', label: 'Profile Settings', icon: User2, desc: 'Edit basic contact' },
    { id: 'security', label: 'Account Security', icon: Settings, desc: 'Password & safety' }
  ];

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      {/* Title */}
      <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider">
        Quick Actions
      </h3>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Card
              key={act.id}
              variant="custom"
              onClick={() => onSelect && onSelect(act.id)}
              className="bg-white border border-gray-150/40 hover:border-[#C5A880]/30 rounded-2xl p-4 flex flex-col items-start justify-between min-h-[105px] transition-all hover:shadow-soft-ui cursor-pointer group text-left active:scale-[0.98]"
            >
              {/* Icon circle */}
              <div className="w-8 h-8 rounded-xl bg-neutral-50 group-hover:bg-[#C5A880]/10 flex items-center justify-center transition-colors mb-4.5">
                <Icon size={14} className="text-[#C5A880] transition-colors" strokeWidth={2.4} />
              </div>
              
              {/* Labels */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-black text-neutral-950 leading-none">
                  {act.label}
                </h4>
                <p className="text-[9px] text-gray-400 font-semibold leading-none mt-1 group-hover:text-gray-500 transition-colors">
                  {act.desc}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
