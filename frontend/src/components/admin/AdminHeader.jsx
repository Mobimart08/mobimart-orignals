import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const AdminHeader = ({ toggleMobileMenu }) => {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      
      {/* Left side: Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <Menu size={20} />
        </button>   
        
        <div className="hidden md:flex items-center relative">
          <Search size={16} className="absolute left-3 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search orders, products..." 
            className="pl-9 pr-4 py-2 bg-neutral-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-gold-accent focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-3 lg:gap-5">
        <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-neutral-200 mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gold-bg text-gold-accent flex items-center justify-center font-bold text-sm ring-2 ring-transparent group-hover:ring-gold-accent transition-all">
            AD
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-neutral-900 leading-tight">Admin User</span>
            <span className="text-xs text-neutral-500">Super Admin</span>
          </div>
        </div>
      </div>
      
    </header>
  );
};

export default AdminHeader;
