import React from 'react';

export const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="info-section">
      <div className="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about Crisper.</p>
      </div>
      
      <div className="faq-container">
        <div className="faq-item">
          <h4>Is the API really free?</h4>
          <p>Yes, Crisper is designed primarily as a free music API for developers to utilize in their own projects.</p>
        </div>
        <div className="faq-item">
          <h4>Why does the link expire in 48 hours?</h4>
          <p>We use tmpfiles.org as our CDN to keep the service fast and completely free without running up huge storage costs.</p>
        </div>
        <div className="faq-item">
          <h4>Are there any rate limits?</h4>
          <p>While we don't have hard paywalls, we employ basic rate limiting to ensure fair usage and keep the engine stable for everyone.</p>
        </div>
      </div>
    </section>
  );
};
