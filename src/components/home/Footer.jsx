import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  RotateCcw, 
  ChevronRight, 
  Mail 
} from 'lucide-react';
import mobimartLogo from '../../assets/mobimart_logo.png';

/* ==========================================================================
   Footer Component (Slice 5)
   - Stacks the complete MobiMart footer experience
   - 1. Benefits Bar: 4 columns of guarantees
   - 2. Popular Brands Strip: Apple, Samsung, Google, Nothing, OnePlus marks
   - 3. Newsletter Section: "Stay Updated" container with subscription form
   - 4. Directory Grid: Shop, Customer Care, My Account, Brand Curation
   - 5. Copyright Info: Copyright and Privacy guidelines
   ========================================================================== */

export const Footer = () => {
  const shopLinks = [
    { name: 'All Products', href: '/store' },
    { name: 'iPhones', href: '/store' },
    { name: 'Samsung', href: '/store' },
    { name: 'Google', href: '/store' },
    { name: 'Nothing', href: '/store' },
    { name: 'OnePlus', href: '/store' }
  ];

  const supportLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'Shipping Policy', href: '#' },
    { name: 'Returns & Refunds', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' }
  ];

  const accountLinks = [
    { name: 'My Orders', href: '#' },
    { name: 'Wishlist', href: '#' },
    { name: 'Track Order', href: '#' },
    { name: 'Login / Register', href: '#' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our updates!');
  };

  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-gray-200/40 relative overflow-hidden select-none z-10">
      
      {/* ==========================================
         SECTION 1: Benefits Bar
         ========================================== */}
      <div className="w-full bg-white border-b border-gray-150/40 py-6 sm:py-9">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          {/* Certified Devices */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0">
              <ShieldCheck size={20} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight">Certified Devices</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">100% Quality Checked</p>
            </div>
          </div>

          {/* 12 Months Warranty */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0">
              <Sparkles size={20} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight">12 Months Warranty</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">Hassle Free Warranty</p>
            </div>
          </div>

          {/* Secure Payments */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0">
              <Lock size={19} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight">Secure Payments</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">100% Safe & Secure</p>
            </div>
          </div>

          {/* Easy Returns */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 border border-neutral-100 shadow-sm shrink-0">
              <RotateCcw size={18} className="text-neutral-900" strokeWidth={2} />
            </div>
            <div>
              <h5 className="text-[10.5px] sm:text-[11.5px] font-extrabold text-neutral-950 leading-tight">Easy Returns</h5>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold tracking-tight">7-Day Return Policy</p>
            </div>
          </div>

        </div>
      </div>



      {/* ==========================================
         SECTION 3: Stay Updated Newsletter Card
         ========================================== */}
      <div className="w-full bg-[#FAF9F6] py-8 border-b border-gray-150/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="w-full bg-[#ECEFF2]/40 border border-neutral-200/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            
            {/* Left Content */}
            <div className="text-center md:text-left z-10">
              <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 leading-tight">Stay Updated</h3>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold mt-0.5 tracking-tight">Get exclusive offers, launches & updates.</p>
            </div>

            {/* Middle Form */}
            <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-sm flex items-center bg-white border border-neutral-200/30 rounded-xl p-1 shadow-sm z-10 shrink-0">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-transparent text-[10px] sm:text-xs text-neutral-800 placeholder-gray-400 px-3 focus:outline-none h-8 sm:h-9"
              />
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-850 text-white text-[9.5px] sm:text-[11px] font-bold px-4 py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>

            {/* Right Side Pedestal/Envelope Art (Pure CSS Graphic) */}
            <div className="hidden lg:flex items-end justify-center h-16 w-24 shrink-0 relative opacity-85 z-10">
              {/* Podium Base */}
              <div className="absolute bottom-0 w-16 h-3 bg-neutral-200 rounded-md border-b border-neutral-300"></div>
              {/* Pedestal Neck */}
              <div className="absolute bottom-2.5 w-10 h-1.5 bg-neutral-250"></div>
              {/* Floating Envelope */}
              <div className="absolute bottom-4 w-12 h-8 bg-gold-bg border border-gold-accent/30 rounded-md flex items-center justify-center shadow-md animate-bounce-slow">
                <Mail size={15} className="text-gold-accent" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==========================================
         SECTION 4: Links Directory Grid
         ========================================== */}
      <div className="w-full bg-[#FAF9F6] py-10 sm:py-12 border-b border-gray-150/40">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
          
          {/* Col 1: Shop */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">Shop</h4>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">Customer Care</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: My Account */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] sm:text-xs font-extrabold text-neutral-950 uppercase tracking-widest">My Account</h4>
            <ul className="flex flex-col gap-2">
              {accountLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-[10px] sm:text-xs text-gray-500 hover:text-gold-accent font-semibold transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 & 5: Brand Curation & Tagline */}
          <div className="col-span-2 flex flex-col items-start gap-4">
            <div className="h-9 sm:h-11 flex items-center justify-start">
              <img 
                src={mobimartLogo} 
                alt="MobiMart logo" 
                className="h-full w-auto object-contain mix-blend-multiply" 
              />
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 font-bold tracking-tight uppercase leading-none">
              Premium Devices. Trusted Always.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 text-neutral-600 select-none">
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.95 4.57c-.88.39-1.83.65-2.82.77 1.02-.61 1.8-1.57 2.17-2.72-.95.56-2 .97-3.12 1.19-.9-.96-2.17-1.56-3.59-1.56-2.72 0-4.92 2.2-4.92 4.92 0 .39.04.76.13 1.12C7.69 8.09 4.07 6.13 1.64 3.16c-.42.73-.67 1.58-.67 2.48 0 1.71.87 3.21 2.19 4.1-.8-.03-1.56-.25-2.22-.61v.06c0 2.38 1.69 4.37 3.94 4.82-.41.11-.85.17-1.3.17-.32 0-.63-.03-.94-.09.62 1.95 2.43 3.38 4.58 3.42-1.68 1.32-3.8 2.11-6.1 2.11-.4 0-.79-.02-1.18-.07 2.18 1.39 4.77 2.21 7.55 2.21 9.05 0 14-7.5 14-14v-.64c.96-.69 1.8-1.56 2.46-2.54z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.5.5-1 1-1h3V2h-3c-2.5 0-4 1.5-4 4v2z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-8 h-8 rounded-full bg-white border border-gray-150/40 flex items-center justify-center hover:text-gold-accent hover:border-gold-accent transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
         SECTION 5: Bottom Copyright Row
         ========================================== */}
      <div className="w-full bg-[#FAF9F6] py-5">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} MobiMart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold-accent transition-colors duration-250">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-gold-accent transition-colors duration-250">Terms & Conditions</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
