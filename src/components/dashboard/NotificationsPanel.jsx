import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Mail, MailOpen } from 'lucide-react';

/* ==========================================================================
   NotificationsPanel Component
   - Renders mock notifications dynamically
   - Allows marking individual notifications as read or clearing all
   - Categorized badges with unread indicator dot status
   ========================================================================== */

export const NotificationsPanel = ({ onUnreadCountChange }) => {
  const [list, setList] = useState([
    {
      id: 1,
      category: 'Order Status',
      time: '1 hour ago',
      message: 'Your order for iPhone 15 Pro Max (#MM240101) has been packed and is ready to ship.',
      unread: true,
    },
    {
      id: 2,
      category: 'Promotion',
      time: '5 hours ago',
      message: 'Get flat 15% OFF on your next purchase using code FIRSTBUY. Valid on premium pre-owned Google devices.',
      unread: true,
    },
    {
      id: 3,
      category: 'System Alert',
      time: 'Yesterday',
      message: 'Security Alert: Password changed successfully for your account.',
      unread: false,
    },
    {
      id: 4,
      category: 'Warranty Update',
      time: '3 days ago',
      message: '12 Months Warranty for Samsung S24 Ultra is now active in your dashboard logs.',
      unread: false,
    }
  ]);

  // Sync unread count to parent on update
  React.useEffect(() => {
    const unreadCount = list.filter(item => item.unread).length;
    onUnreadCountChange && onUnreadCountChange(unreadCount);
  }, [list, onUnreadCountChange]);

  const toggleRead = (id) => {
    setList(prev => prev.map(item => 
      item.id === id ? { ...item, unread: !item.unread } : item
    ));
  };

  const markAllRead = () => {
    setList(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const clearAll = () => {
    setList([]);
  };

  return (
    <div className="w-full select-none text-left flex flex-col gap-3">
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 flex-wrap gap-2">
        <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
          <Bell size={14} className="text-[#C5A880]" strokeWidth={2.4} />
          <span>Notifications</span>
        </h3>
        
        {list.length > 0 && (
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400">
            <button 
              type="button"
              onClick={markAllRead}
              className="hover:text-[#C5A880] transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCheck size={11} />
              Mark all read
            </button>
            <span>|</span>
            <button 
              type="button"
              onClick={clearAll}
              className="hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="w-full bg-white border border-gray-150/40 rounded-3xl p-6 text-center shadow-soft-ui py-8">
          <p className="text-xs text-gray-400 font-bold">All caught up! No new notifications.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {list.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start relative ${
                item.unread 
                  ? 'bg-neutral-950/[0.01] border-[#C5A880]/15 shadow-sm' 
                  : 'bg-white border-neutral-100/70 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Unread dot */}
              {item.unread && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-4 left-4" />
              )}

              {/* Icon Container */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1.5 ${
                item.unread ? 'bg-neutral-100' : 'bg-neutral-50'
              }`}>
                {item.unread ? (
                  <Mail size={12} className="text-[#C5A880]" strokeWidth={2.4} />
                ) : (
                  <MailOpen size={12} className="text-gray-400" strokeWidth={2.2} />
                )}
              </div>

              {/* Message text details */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black text-neutral-900 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[8.5px] text-gray-400 font-semibold">
                    {item.time}
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-800 font-semibold leading-relaxed mt-1">
                  {item.message}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default NotificationsPanel;
