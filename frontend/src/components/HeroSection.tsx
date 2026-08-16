import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="badge-tag">
        <span className="badge-dot" />
        <span>Free Music API & Audio Engine</span>
      </div>
      <h2 className="hero-title">
        A <span className="hero-title-pink">Crisper</span> Way to Find
        <br />
        Your Music
      </h2>
      <p className="hero-subtitle">
        Search any track title or paste a media link to choose from top matches and stream{' '}
        <span className="hero-highlight-text">high-quality free</span> audio instantly.
      </p>
    </section>
  );
};
