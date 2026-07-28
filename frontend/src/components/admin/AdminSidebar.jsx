import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, MessageSquare } from 'lucide-react';

const AdminSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <span className="text-xl font-bold tracking-tight text-neutral-900">
            MobiMart <span className="text-gold-accent font-medium">Admin</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-4rem-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gold-bg text-gold-dark shadow-sm' 
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Action (Logout) */}
        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
