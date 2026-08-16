'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { StatusPill } from './StatusPill';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '@/hooks/useTheme';

interface HeaderProps {
  status: 'waking' | 'online' | 'offline';
  statusText: string;
  onCheckHealth: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  themeMounted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  statusText,
  onCheckHealth,
  theme,
  onToggleTheme,
  themeMounted,
}) => {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleMobileLinkClick = (hashVal: string) => {
    setHash(hashVal);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Sync hash when component mounts and whenever Next.js changes the route
    setHash(window.location.hash);
    
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    
    // We need a tiny delay to ensure the DOM has updated classes before measuring
    const timer = setTimeout(() => {
      const activeLink = navRef.current?.querySelector('.header-nav-pill.active') as HTMLElement;
      if (activeLink) {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }, 10);
    
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return (
    <header className={`app-header ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <Link href="/" className="logo-container">
        <div className="logo-icon">
          <Image
            src="/assets/logo-icon-white.svg"
            alt="crisper logo"
            width={48}
            height={48}
            className="logo-icon-img logo-dark"
            priority
          />
          <Image
            src="/assets/logo-icon-black.svg"
            alt="crisper logo"
            width={48}
            height={48}
            className="logo-icon-img logo-light"
            priority
          />
        </div>
        <div className="logo-text">
          <h1>crisper</h1>
          <span>Free Music API</span>
        </div>
      </Link>

      <nav className="header-nav-links" ref={navRef} style={{ position: 'relative' }}>
        <div className="nav-active-indicator" style={{
          position: 'absolute',
          bottom: '-4px',
          height: '2px',
          background: 'var(--c-crimson)',
          borderRadius: '2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          pointerEvents: 'none'
        }} />
        <Link href="/" className={`header-nav-pill ${pathname === '/' && hash !== '#features' ? 'active' : ''}`} onClick={() => setHash('')}>
          Home
        </Link>
        <Link href="/#features" className={`header-nav-pill ${pathname === '/' && hash === '#features' ? 'active' : ''}`} onClick={() => setHash('#features')}>
          Features
        </Link>
        <Link href="/docs" className={`header-nav-pill ${pathname.startsWith('/docs') ? 'active' : ''}`} onClick={() => setHash('')}>
          API Docs
        </Link>
        <Link href="/about" className={`header-nav-pill ${pathname === '/about' ? 'active' : ''}`} onClick={() => setHash('')}>
          About
        </Link>
      </nav>

      <div className="header-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} mounted={themeMounted} />
        <div className="desktop-only-status">
          <StatusPill status={status} text={statusText} onClick={onCheckHealth} />
        </div>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-dropdown">
          <Link href="/" className="mobile-nav-link" onClick={() => handleMobileLinkClick('')}>Home</Link>
          <Link href="/#features" className="mobile-nav-link" onClick={() => handleMobileLinkClick('#features')}>Features</Link>
          <Link href="/docs" className="mobile-nav-link" onClick={() => handleMobileLinkClick('')}>API Docs</Link>
          <Link href="/about" className="mobile-nav-link" onClick={() => handleMobileLinkClick('')}>About</Link>
          <div className="mobile-menu-divider" />
          <div className="mobile-status-container">
            <StatusPill status={status} text={statusText} onClick={() => {
              onCheckHealth();
              setIsMobileMenuOpen(false);
            }} />
          </div>
        </div>
      )}
    </header>
  );
};
