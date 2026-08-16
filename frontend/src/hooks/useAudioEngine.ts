'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultApiClient, ApiClient } from '@/lib/api';
import { ConversionResult, TrackResult, VideoInfo } from '@/types';

export function useAudioEngine(showToast: (msg: string, type?: 'info' | 'success' | 'error') => void) {
  const [backendStatus, setBackendStatus] = useState<'waking' | 'online' | 'offline'>('waking');
  const [backendStatusText, setBackendStatusText] = useState<string>('Checking Engine...');
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TrackResult[]>([]);
  const [videoPreview, setVideoPreview] = useState<VideoInfo | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(1);
  const [pipelineMessage, setPipelineMessage] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [visualizerActive, setVisualizerActive] = useState<boolean>(false);

  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check health on mount and periodically
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

  // Live video preview when typing direct YouTube URL
  const handleQueryChange = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setVideoPreview(null);
      return;
    }

    const videoId = ApiClient.extractYouTubeId(text.trim());
    if (videoId) {
      try {
        const info = await defaultApiClient.getVideoInfo(text.trim());
        setVideoPreview(info);
      } catch {
        // Fallback silently
      }
    } else {
      setVideoPreview(null);
    }
  }, []);

  // Clear query and search results
  const clearQuery = useCallback(() => {
    setQuery('');
    setVideoPreview(null);
    setSearchResults([]);
  }, []);


  // Master and download track
  const startDownloadTrack = useCallback(async (track: { id: string; title: string }) => {
    setIsConverting(true);
    setVisualizerActive(true);
    setSearchResults([]);
    setConversionResult(null);
    setPipelineStep(1);
    setPipelineMessage(`Mastering 320kbps stream for "${track.title}"...`);

    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);

    try {
      const result = await defaultApiClient.requestConversion(
        track.id,
        { format: 'mp3', quality: '320kbps' },
        (step, msg) => {
          setPipelineStep(step);
          if (msg) setPipelineMessage(msg);
        }
      );

      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setPipelineStep(5);
      setPipelineMessage('Stream ready!');
      setConversionResult(result);

      // Trigger automatic download
      const tempLink = document.createElement('a');
      tempLink.href = result.downloadUrl;
      tempLink.download = result.filename;
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();

      showToast('Download started automatically!', 'success');
    } catch (err: unknown) {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      const errMsg = err instanceof Error ? err.message : 'An error occurred during audio mastering';
      showToast(errMsg, 'error');
    } finally {
      setIsConverting(false);
      setVisualizerActive(false);
    }
  }, [showToast]);

  // Search or direct convert
  const handleSearchOrConvert = useCallback(async () => {
    const rawInput = query.trim();
    if (!rawInput) {
      showToast('Please enter a song title or media link', 'error');
      return;
    }

    const directId = ApiClient.extractYouTubeId(rawInput);
    if (directId) {
      startDownloadTrack({ id: directId, title: videoPreview?.title || `Track (${directId})` });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setConversionResult(null);

    try {
      const tracks = await defaultApiClient.searchTracks(rawInput);
      if (!tracks || tracks.length === 0) {
        showToast(`No tracks found for "${rawInput}". Try another title.`, 'error');
        return;
      }

      setSearchResults(tracks);
      showToast(`Found ${tracks.length} matching tracks! Click any card to download 320kbps MP3.`, 'success');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Search failed. Please check backend connection.';
      showToast(errMsg, 'error');
    } finally {
      setIsSearching(false);
    }
  }, [query, videoPreview, showToast, startDownloadTrack]);

  // Reset form
  const resetForm = useCallback(() => {
    setConversionResult(null);
    setIsConverting(false);
    setSearchResults([]);
    setQuery('');
    setVideoPreview(null);
    setVisualizerActive(false);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
  }, []);

  return {
    backendStatus,
    backendStatusText,
    checkHealth,
    query,
    setQuery,
    handleQueryChange,
    clearQuery,
    isSearching,
    isConverting,
    searchResults,
    videoPreview,
    pipelineStep,
    pipelineMessage,
    conversionResult,
    visualizerActive,
    handleSearchOrConvert,
    startDownloadTrack,
    resetForm,
    baseUrl: defaultApiClient.getBaseUrl(),
  };
}
