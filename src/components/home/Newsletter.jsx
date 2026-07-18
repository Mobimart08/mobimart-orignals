import React from 'react';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Button from '../ui/Button';

/* ==========================================================================
   Newsletter Component
   - Contains a newsletter registration banner card
   - Left side: Title, subtext, and email form (input + "Download" CTA)
   - Right side: Smartphone mockup displaying a mailing template
   ========================================================================== */

export const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="w-full pb-8 bg-white">
      <Container>
        <Card
          variant="custom"
          className="bg-[#ECEFF2] border border-gray-200/10 p-6 sm:p-10 relative overflow-hidden rounded-[24px] sm:rounded-[32px] h-[200px] sm:h-[280px]"
        >
          {/* Subtle Abstract Background Decoration */}
          <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full border border-gold-accent/5 pointer-events-none" aria-hidden="true"></div>
          <div className="absolute top-[10%] right-[-10%] w-[180px] sm:w-[260px] h-[180px] sm:h-[260px] rounded-full border border-gold-accent/5 pointer-events-none" aria-hidden="true"></div>

          <div className="grid grid-cols-12 gap-4 items-center h-full relative z-10">
            {/* Left: Heading, details and Form */}
            <div className="col-span-7 flex flex-col items-start text-left h-full justify-center pr-2 sm:pr-6">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 leading-tight mb-2 tracking-tight">
                Newsletter
              </h3>
              
              <p className="text-[9px] sm:text-xs md:text-sm text-gray-500 font-semibold leading-relaxed mb-4 sm:mb-6 max-w-[200px] sm:max-w-md">
                Stay Ahead. Join MobiMart insights. smart gold-decorative accounts.
              </p>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2.5 w-full max-w-sm">
                <input
                  type="email"
                  placeholder="Enter email"
                  required
                  className="h-8 sm:h-11 px-3 sm:px-5 rounded-full border border-gray-250 bg-white/70 backdrop-blur-sm text-[9px] sm:text-xs text-neutral-800 placeholder-gray-400 focus:outline-none focus:border-gold-accent transition-colors duration-200 w-full"
                  aria-label="Email address"
                />
                
                <Button 
                  type="submit"
                  variant="secondary" 
                  size="sm" 
                  className="cursor-pointer !px-4 !py-2 sm:!px-6 sm:!py-3.5 text-[8px] sm:text-xs shrink-0 whitespace-nowrap shadow-sm h-8 sm:h-11 hover:bg-neutral-800 transition-all"
                >
                  Download
                </Button>
              </form>
            </div>

            {/* Right: Minimal premium floating device ecosystem (Phone, Watch, Earbuds, Tablet) */}
            <div className="col-span-5 h-full flex items-center justify-end relative">
              {/* Soft gold radial glow behind */}
              <div className="absolute top-[20%] right-[-10%] w-[120px] sm:w-[220px] h-[120px] sm:h-[220px] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

              {/* Gold wireframe ecosystem SVG */}
              <svg 
                viewBox="0 0 200 200" 
                className="w-[120px] sm:w-[190px] h-auto object-contain z-10 mr-1 select-none pointer-events-none transition-opacity duration-300 opacity-95 group-hover:opacity-100"
              >
                {/* Phone Wireframe */}
                <g transform="translate(60, 30)">
                  {/* Phone body */}
                  <rect x="0" y="0" width="70" height="135" rx="14" fill="none" stroke="#C5A880" strokeWidth="1.5" strokeOpacity="0.8" />
                  {/* Screen bezel inner */}
                  <rect x="3" y="3" width="64" height="129" rx="11" fill="none" stroke="#C5A880" strokeWidth="0.8" strokeOpacity="0.3" />
                  {/* Dynamic Island */}
                  <rect x="23" y="8" width="24" height="5" rx="2.5" fill="none" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.6" />
                  {/* Speaker grill */}
                  <line x1="31" y1="5" x2="39" y2="5" stroke="#C5A880" strokeWidth="0.5" strokeOpacity="0.4" />
                </g>

                {/* Tablet Wireframe (Behind phone) */}
                <g transform="translate(20, 20)">
                  {/* Tablet body */}
                  <rect x="0" y="0" width="95" height="135" rx="10" fill="none" stroke="#C5A880" strokeWidth="1" strokeOpacity="0.25" />
                  <rect x="4" y="4" width="87" height="127" rx="7" fill="none" stroke="#C5A880" strokeWidth="0.5" strokeOpacity="0.15" />
                </g>

                {/* Smart Watch Wireframe (Floating bottom left) */}
                <g transform="translate(10, 110)">
                  {/* Watch body */}
                  <rect x="0" y="0" width="34" height="40" rx="8" fill="none" stroke="#C5A880" strokeWidth="1.2" strokeOpacity="0.6" />
                  <rect x="2" y="2" width="30" height="36" rx="6" fill="none" stroke="#C5A880" strokeWidth="0.6" strokeOpacity="0.3" />
                  {/* Watch crown */}
                  <rect x="34" y="14" width="2" height="8" rx="1" fill="none" stroke="#C5A880" strokeWidth="0.8" strokeOpacity="0.5" />
                  {/* Watch strap outlines */}
                  <path d="M7 -15 L7 0 M27 -15 L27 0 M7 40 L7 55 M27 40 L27 55" stroke="#C5A880" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2,2" />
                </g>

                {/* Earbuds Case Wireframe (Floating bottom right) */}
                <g transform="translate(125, 120)">
                  {/* Earbud Case body */}
                  <rect x="0" y="0" width="32" height="32" rx="10" fill="none" stroke="#C5A880" strokeWidth="1.2" strokeOpacity="0.5" />
                  {/* Case seam line */}
                  <path d="M0 11 L32 11" stroke="#C5A880" strokeWidth="0.8" strokeOpacity="0.4" />
                  {/* LED charging dot */}
                  <circle cx="16" cy="20" r="1" fill="#C5A880" fillOpacity="0.6" />
                </g>
              </svg>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
};

export default Newsletter;
