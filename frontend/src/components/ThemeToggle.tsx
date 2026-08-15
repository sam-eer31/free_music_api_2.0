'use client';

import React from 'react';
import { Theme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  mounted: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, mounted }) => {
  if (!mounted) {
    return (
      <div className="theme-toggle-btn skeleton" aria-hidden="true">
        <span className="theme-toggle-placeholder" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      {isDark ? (
        // Sun Icon for Dark -> Light switch
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="theme-icon sun-icon"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon Icon for Light -> Dark switch
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="theme-icon moon-icon"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
};
