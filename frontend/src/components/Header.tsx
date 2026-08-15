'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const isDocs = pathname === '/docs';

  return (
    <header className="app-header">
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
          <span>Studio Audio Core</span>
        </div>
      </Link>

      <nav className="header-nav-links">
        <Link href="/" className={`header-nav-pill ${!isDocs ? 'active' : ''}`}>
          Studio App
        </Link>
        <Link href="/docs" className={`header-nav-pill ${isDocs ? 'active' : ''}`}>
          API Docs <span className="nav-badge-v1">v1</span>
        </Link>
      </nav>

      <div className="header-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} mounted={themeMounted} />
        <StatusPill status={status} text={statusText} onClick={onCheckHealth} />
      </div>
    </header>
  );
};
