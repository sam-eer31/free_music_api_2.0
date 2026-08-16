'use client';

import React, { useRef, useState } from 'react';

export const FeaturesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
      title: "High Quality Audio",
      desc: "Our extraction engine profiles and packages audio into high-fidelity formats, giving you pristine sound every time."
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
      title: "Free Music API",
      desc: "A single, unified REST endpoint built for developers. Search, resolve, and extract music completely free."
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>,
      title: "Instant Cloud Delivery",
      desc: "Audio is instantly processed and delivered via short-lived CDN links (48h), keeping downloads blazing fast."
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c-crimson)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>,
      title: "Ad-Free Experience",
      desc: "No shady popups or captchas. Just a clean, premium, and glass-morphic interface focused on music."
    }
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    // We assume all cards are roughly the same width in the scroll container
    const firstCard = scrollRef.current.querySelector('.feature-card') as HTMLElement;
    if (!firstCard) return;
    
    // Add gap to card width for accurate calculation
    const cardWidth = firstCard.offsetWidth + 16; // 1rem gap = 16px
    const index = Math.round(scrollPosition / cardWidth);
    
    // Ensure index is within bounds
    setActiveIndex(Math.max(0, Math.min(index, features.length - 1)));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector('.feature-card') as HTMLElement;
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  return (
    <section id="features" className="info-section">
      <div className="section-header">
        <h2>Why Choose Crisper?</h2>
        <p>Built for speed, simplicity, and an uncompromising developer experience.</p>
      </div>
      
      <div className="features-slider-container">
        <div 
          className="features-grid" 
          ref={scrollRef} 
          onScroll={handleScroll}
        >
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="slider-dots">
          {features.map((_, idx) => (
            <button
              key={idx}
              className={`slider-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
