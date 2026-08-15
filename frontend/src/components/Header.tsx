'use client';

import React from 'react';
import Image from 'next/image';
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
  return (
    <header className="app-header">
      <a href="#" className="logo-container">
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
      </a>

      <div className="header-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} mounted={themeMounted} />
        <StatusPill status={status} text={statusText} onClick={onCheckHealth} />
      </div>
    </header>
  );
};
