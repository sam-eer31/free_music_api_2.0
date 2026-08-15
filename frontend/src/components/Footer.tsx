import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div>crisper • Studio Audio Core</div>
        <div className="footer-links">
          <a href="#" className="footer-link">
            Fast Edge CDN
          </a>
          <a href="#" className="footer-link">
            320kbps Studio Master
          </a>
          <a href="#" className="footer-link">
            Cloud Audio Engine
          </a>
        </div>
      </div>
    </footer>
  );
};
