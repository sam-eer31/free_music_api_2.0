'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('crisper-theme') as Theme | null;
    const initialTheme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('crisper-theme', newTheme);

    // Disable all transitions during theme swap to guarantee 100% synchronized zero-blink paint
    document.documentElement.classList.add('no-transitions');
    document.documentElement.setAttribute('data-theme', newTheme);

    // Force synchronous layout/style computation so all elements update in 1 single frame
    window.getComputedStyle(document.documentElement).opacity;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return { theme, toggleTheme, setTheme, mounted };
}
