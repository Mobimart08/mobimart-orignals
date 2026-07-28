import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Mail, MailOpen } from 'lucide-react';
import { notificationService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/* ==========================================================================
   NotificationsPanel Component
   - Renders live notifications dynamically from the backend
   - Allows marking individual notifications as read or clearing all
   - Categorized badges with unread indicator dot status
   ========================================================================== */

export const NotificationsPanel = ({ onUnreadCountChange }) => {
  const [list, setList] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getNotifications();
      setList(res.data.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Sync unread count to parent on update
  useEffect(() => {
    const unreadCount = list.filter(item => !item.isRead).length;
    if (onUnreadCountChange) onUnreadCountChange(unreadCount);
  }, [list, onUnreadCountChange]);

  const toggleRead = async (item) => {
    if (item.isRead) {
      // If it has a link, just navigate, it's already read
      if (item.link) navigate(item.link);
      return;
    }
    
    try {
      setList(prev => prev.map(n => n._id === item._id ? { ...n, isRead: true } : n));
      await notificationService.markAsRead(item._id);
      if (item.link) navigate(item.link);
    } catch (err) {
      console.error(err);
      showToast('Failed to mark notification as read', 'error');
    }
  };

  const markAllRead = async () => {
    try {
      setList(prev => prev.map(item => ({ ...item, isRead: true })));
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error(err);
      showToast('Failed to mark all as read', 'error');
    }
  };

  const clearAll = async () => {
    try {
      for (const item of list) {
        await notificationService.deleteNotification(item._id);
      }
      setList([]);
    } catch (err) {
      console.error(err);
      showToast('Failed to clear notifications', 'error');
    }
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
          {list.map((item) => {
            const timeAgo = new Date(item.createdAt).toLocaleString('en-IN', {
              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
            });
            return (
            <div 
              key={item._id}
              onClick={() => toggleRead(item)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start relative ${
                !item.isRead 
                  ? 'bg-neutral-950/[0.01] border-[#C5A880]/15 shadow-sm' 
                  : 'bg-white border-neutral-100/70 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Unread dot */}
              {!item.isRead && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-4 left-4" />
              )}

              {/* Icon Container */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1.5 ${
                !item.isRead ? 'bg-neutral-100' : 'bg-neutral-50'
              }`}>
                {!item.isRead ? (
                  <Mail size={12} className="text-[#C5A880]" strokeWidth={2.4} />
                ) : (
                  <MailOpen size={12} className="text-gray-400" strokeWidth={2.2} />
                )}
              </div>

              {/* Message text details */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black text-neutral-900 uppercase tracking-wider">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[8.5px] text-gray-400 font-semibold">
                    {timeAgo}
                  </span>
                </div>
                <h4 className="text-[10px] sm:text-xs font-black text-neutral-950 mt-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-neutral-800 font-semibold leading-relaxed mt-0.5">
                  {item.message}
                </p>
              </div>

            </div>
          )})}
        </div>
      )}

    </div>
  );
};

export default NotificationsPanel;
