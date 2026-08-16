import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="info-section alternate-bg">
      <div className="section-header">
        <h2>How It Works</h2>
        <p>A seamless pipeline from search to your local drive.</p>
      </div>
      
      <div className="steps-container">
        <div className="step-item">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Search or Paste</h4>
            <p>Enter any song title or paste a direct media URL into the engine.</p>
          </div>
        </div>
        <div className="step-separator"></div>
        <div className="step-item">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Engine Processing</h4>
            <p>Our servers resolve the track and process it into a high-quality container.</p>
          </div>
        </div>
        <div className="step-separator"></div>
        <div className="step-item">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Cloud Delivery</h4>
            <p>Get a direct, ad-free download link instantly hosted on our CDN.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
