'use client';

import React from 'react';
import Image from 'next/image';
import { StatusPill } from './StatusPill';

interface HeaderProps {
  status: 'waking' | 'online' | 'offline';
  statusText: string;
  onCheckHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, statusText, onCheckHealth }) => {
  return (
    <header className="app-header">
      <a href="#" className="logo-container">
        <div className="logo-icon">
          <Image
            src="/assets/logo-icon.svg"
            alt="crisper logo"
            width={40}
            height={40}
            className="logo-icon-img"
            priority
          />
        </div>
        <div className="logo-text">
          <h1>crisper</h1>
          <span>Studio Audio Core</span>
        </div>
      </a>

      <div className="header-actions">
        <StatusPill status={status} text={statusText} onClick={onCheckHealth} />
      </div>
    </header>
  );
};
