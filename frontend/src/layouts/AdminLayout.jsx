import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#FAF9F6] text-neutral-950 font-sans antialiased flex selection:bg-[#EBDCD0] selection:text-gold-dark">
      
      {/* Sidebar Navigation */}
      <AdminSidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Top Header */}
        <AdminHeader toggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 animate-page-in">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default AdminLayout;
