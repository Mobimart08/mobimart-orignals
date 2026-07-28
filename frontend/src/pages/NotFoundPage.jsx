import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SEO from '../components/ui/SEO';
import { ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <MainLayout>
      <SEO title="404 Page Not Found" description="The page you are looking for does not exist on MobiMart." />
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF9F6] select-none">
        <div className="w-20 h-20 rounded-full bg-gold-bg border border-[#EBDCD0] flex items-center justify-center text-[#C5A880] mb-6 shadow-soft-ui">
          <Search size={32} />
        </div>

        <h1 className="text-4xl font-black text-neutral-950 mb-2">404</h1>
        <h2 className="text-lg sm:text-xl font-bold text-neutral-800 mb-3">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
          The requested page URL could not be found or has been moved to another location.
        </p>

        <Link
          to="/store"
          className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
