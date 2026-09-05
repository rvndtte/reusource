import React, { useEffect, useRef, useState } from 'react';

export default function ScrollRevealSection({ children, id, className = '', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`scroll-reveal-container ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0px) scale(1) rotateX(0deg)'
          : 'translateY(60px) scale(0.95) rotateX(5deg)',
        transition: `opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        perspective: '1200px',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
}
