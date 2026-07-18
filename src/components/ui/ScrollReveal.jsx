import React, { useEffect, useRef, useState } from 'react';

/* ==========================================================================
   ScrollReveal Wrapper Component
   - Triggers clean fade-in and translateY animations when sections enter viewport
   - Uses browser-native IntersectionObserver for performance
   - Fires once only (unobserves immediately upon entering viewport)
   - Supports transition delays for staggered grid children
   ========================================================================== */

export const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If IntersectionObserver is not supported, display content immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,              // Fire early when 5% of element is visible
        rootMargin: '0px 0px -40px 0px' // Triggers slightly before crossing viewport line
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
