'use client';

import React from 'react';
import { ToastProvider, useToast } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import { useEngineHealth } from '@/hooks/useEngineHealth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { backendStatus, backendStatusText, checkHealth, baseUrl } = useEngineHealth();
  const { showToast } = useToast();

  return (
    <>
      <Header
        status={backendStatus}
        statusText={backendStatusText}
        onCheckHealth={() => {
          checkHealth();
          showToast(`Checking engine at: ${baseUrl}`, 'info');
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        themeMounted={mounted}
      />
      <main className="app-main">
        {children}
      </main>
      <Footer />
    </>
  );
}

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
