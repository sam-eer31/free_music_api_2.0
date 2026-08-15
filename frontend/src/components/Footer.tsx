import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div>crisper • Studio Audio Core</div>
        <div className="footer-links">
          <Link href="/docs" className="footer-link">
            Developer API v1
          </Link>
          <span className="footer-link">
            320kbps Studio Master
          </span>
          <span className="footer-link">
            48h tmpfiles CDN
          </span>
        </div>
      </div>
    </footer>
  );
};
