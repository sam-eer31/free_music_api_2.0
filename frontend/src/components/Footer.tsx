import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link href="/" className="logo-container" style={{ marginBottom: '1.2rem', display: 'inline-flex' }}>
            <div className="logo-icon">
              <Image
                src="/assets/logo-icon-white.svg"
                alt="crisper logo"
                width={48}
                height={48}
                className="logo-icon-img logo-dark"
              />
              <Image
                src="/assets/logo-icon-black.svg"
                alt="crisper logo"
                width={48}
                height={48}
                className="logo-icon-img logo-light"
              />
            </div>
            <div className="logo-text">
              <h1 style={{ fontSize: '1.55rem' }}>crisper</h1>
            </div>
          </Link>
          <p className="footer-tagline">High-Quality Free Music API & Extraction Engine.</p>
        </div>
        
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/#features">Features</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/#faq">FAQ</Link>
          </div>
          
          <div className="footer-col">
            <h4>Developers</h4>
            <Link href="/docs">API Documentation</Link>
            <a href="https://github.com/sam-eer31/free_music_api_2.0" target="_blank" rel="noreferrer">GitHub Repository</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} crisper. All rights reserved.</p>
      </div>
    </footer>
  );
};
