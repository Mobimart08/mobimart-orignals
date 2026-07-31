import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, rootMargin = '200px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [rootMargin]);

  return (
    <div ref={domRef} style={{ minHeight: isVisible ? 'auto' : '100px' }}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazySection;
