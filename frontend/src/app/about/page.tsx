'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <>
      <div className="section-header">
        <h2>About Us</h2>
        <p>Who we are and what we are building.</p>
      </div>
      
      <div className="text-content">
        <p>
          Welcome to <strong>crisper</strong>. We are a team of passionate developers focused on building accessible, high-performance tools for the web.
        </p>
        <p>
          When we started this project, our primary goal was simple: we wanted to build a truly <strong>Free Music API</strong>. We noticed a lack of reliable, fast, and developer-friendly endpoints that could handle the heavy lifting of audio extraction and processing without hiding behind complex paywalls or ad-ridden interfaces.
        </p>
        <p>
          While we initially focused heavily on specific high-fidelity profiles, our true obsession lies in providing a robust, high-quality music API for everyone. Whether you are a developer looking to integrate audio search and streaming into your own application, or a user looking for a clean tool, crisper is built for you.
        </p>
        <p>
          We believe in open access and premium experiences. That's why we don't serve ads, we don't require API keys, and we deliver our processed containers via rapid, temporary CDN links.
        </p>
      </div>
    </>
  );
}
