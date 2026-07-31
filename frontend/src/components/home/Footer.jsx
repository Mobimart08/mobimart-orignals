import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  RotateCcw, 
  Mail 
} from 'lucide-react';
import mobimartLogo from '../../assets/mobimart_logo.webp';

/* ==========================================================================
   Footer Component
   - Benefit cards -> Policy modals
   - Directory Links -> Client routing & policy modals
   - Social Icons -> Coming soon
   ========================================================================== */

export const Footer = ({ onShippingClick, onWarrantyClick, onCertificationClick, onComingSoonClick }) => {
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-gray-200/40 relative overflow-hidden select-none z-10">
      
      {/* SECTION 1: Benefits Bar */}
      <div className="w-full bg-white border-b border-gray-150/40 py-6 sm:py-9">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          {/* Certified Devices */}
          <div onClick={onCertificationClick} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight group-hover:text-gold-accent transition-colors">Certified Devices</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">100% Quality Checked</p>
            </div>
          </div>

          {/* 12 Months Warranty */}
          <div onClick={onWarrantyClick} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles size={20} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight group-hover:text-gold-accent transition-colors">12 Months Warranty</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">Hassle Free Warranty</p>
            </div>
          </div>

          {/* Secure Payments */}
          <div onClick={onCertificationClick} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Lock size={19} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight group-hover:text-gold-accent transition-colors">Secure Payments</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">100% Safe & Secure</p>
            </div>
          </div>

          {/* Easy Returns */}
          <div onClick={onShippingClick} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw size={18} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight group-hover:text-gold-accent transition-colors">Easy Returns</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">7-Day Return Policy</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: Stay Updated Newsletter Card */}
      <div className="w-full bg-[#FAF9F6] py-8 border-b border-gray-150/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="w-full bg-[#ECEFF2]/40 border border-neutral-200/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="text-center md:text-left z-10">
              <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 leading-tight">Stay Updated</h3>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold mt-0.5 tracking-tight">Get exclusive offers, launches & updates.</p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-sm flex items-center bg-white border border-neutral-200/30 rounded-xl p-1 shadow-sm z-10 shrink-0">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-transparent text-[10px] sm:text-xs text-neutral-800 placeholder-gray-400 px-3 focus:outline-none h-8 sm:h-9"
              />
              <button
                type="submit"
                onClick={onComingSoonClick}
                className="bg-neutral-950 hover:bg-neutral-850 text-white text-[9.5px] sm:text-[11px] font-bold px-4 py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>

            <div className="hidden lg:flex items-end justify-center h-16 w-24 shrink-0 relative opacity-85 z-10">
              <div className="absolute bottom-0 w-16 h-3 bg-neutral-200 rounded-md border-b border-neutral-300" />
              <div className="absolute bottom-2.5 w-10 h-1.5 bg-neutral-250" />
              <div className="absolute bottom-4 w-12 h-8 bg-gold-bg border border-gold-accent/30 rounded-md flex items-center justify-center shadow-md animate-bounce-slow">
                <Mail size={15} className="text-gold-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Links Directory Grid */}
      <div className="w-full bg-[#FAF9F6] py-10 sm:py-12 border-b border-gray-150/40">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
          
          {/* Col 1: Shop */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/store" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">All Products</Link></li>
              <li><Link to="/store?brand=Apple" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">iPhones</Link></li>
              <li><Link to="/store?brand=Samsung" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Samsung</Link></li>
              <li><Link to="/store?brand=Google" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Google</Link></li>
              <li><Link to="/store?brand=Nothing" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Nothing</Link></li>
              <li><Link to="/store?brand=OnePlus" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">OnePlus</Link></li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">Customer Care</h4>
            <ul className="flex flex-col gap-2">
              <li><button type="button" onClick={onCertificationClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">About Us</button></li>
              <li><button type="button" onClick={onComingSoonClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">Contact Us</button></li>
              <li><button type="button" onClick={onShippingClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">Shipping Policy</button></li>
              <li><button type="button" onClick={onWarrantyClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">Returns & Refunds</button></li>
              <li><button type="button" onClick={onCertificationClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">Terms & Conditions</button></li>
              <li><button type="button" onClick={onCertificationClick} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors text-left">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Col 3: My Account */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">My Account</h4>
            <ul className="flex flex-col gap-2">
              <li><Link to="/dashboard" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">My Orders</Link></li>
              <li><Link to="/store" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Wishlist</Link></li>
              <li><Link to="/dashboard" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Track Order</Link></li>
              <li><Link to="/dashboard" className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Col 4 & 5: Brand Curation & Tagline */}
          <div className="col-span-2 flex flex-col items-start gap-3 sm:gap-4">
            <div className="h-8 sm:h-10 md:h-12 w-full flex items-center justify-start mt-1">
              <Link to="/" className="block h-full transition-opacity hover:opacity-80">
                <img 
                  src={mobimartLogo} 
                  alt="MobiMart logo" 
                  className="h-full w-auto object-contain object-left mix-blend-multiply" 
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </Link>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-tight uppercase leading-none">
              Premium Devices. Trusted Always.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 text-neutral-600 select-none">
              <button type="button" onClick={onComingSoonClick} className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-xs cursor-pointer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </button>
              <button type="button" onClick={onComingSoonClick} className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-xs cursor-pointer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.95 4.57c-.88.39-1.83.65-2.82.77 1.02-.61 1.8-1.57 2.17-2.72-.95.56-2 .97-3.12 1.19-.9-.96-2.17-1.56-3.59-1.56-2.72 0-4.92 2.2-4.92 4.92 0 .39.04.76.13 1.12C7.69 8.09 4.07 6.13 1.64 3.16c-.42.73-.67 1.58-.67 2.48 0 1.71.87 3.21 2.19 4.1-.8-.03-1.56-.25-2.22-.61v.06c0 2.38 1.69 4.37 3.94 4.82-.41.11-.85.17-1.3.17-.32 0-.63-.03-.94-.09.62 1.95 2.43 3.38 4.58 3.42-1.68 1.32-3.8 2.11-6.1 2.11-.4 0-.79-.02-1.18-.07 2.18 1.39 4.77 2.21 7.55 2.21 9.05 0 14-7.5 14-14v-.64c.96-.69 1.8-1.56 2.46-2.54z"/></svg>
              </button>
              <button type="button" onClick={onComingSoonClick} className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-xs cursor-pointer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.5.5-1 1-1h3V2h-3c-2.5 0-4 1.5-4 4v2z"/></svg>
              </button>
              <button type="button" onClick={onComingSoonClick} className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-xs cursor-pointer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 5: Bottom Copyright Row */}
      <div className="w-full bg-[#FAF9F6] py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} MobiMart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onCertificationClick} className="hover:text-gold-accent transition-colors">Privacy Policy</button>
            <span>|</span>
            <button type="button" onClick={onCertificationClick} className="hover:text-gold-accent transition-colors">Terms & Conditions</button>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
