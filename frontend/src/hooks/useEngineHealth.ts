'use client';

import { useState, useEffect, useCallback } from 'react';
import { defaultApiClient } from '@/lib/api';

export function useEngineHealth() {
  const [backendStatus, setBackendStatus] = useState<'waking' | 'online' | 'offline'>('waking');
  const [backendStatusText, setBackendStatusText] = useState<string>('Checking Engine...');

  const checkHealth = useCallback(async () => {
    setBackendStatus('waking');
    setBackendStatusText('Checking Engine...');
    const result = await defaultApiClient.checkHealth();
    if (result.online) {
      setBackendStatus('online');
      setBackendStatusText('Engine Ready');
    } else {
      setBackendStatus('offline');
      setBackendStatusText('Engine Offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { backendStatus, backendStatusText, checkHealth, baseUrl: defaultApiClient.baseUrl };
}
