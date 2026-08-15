'use client';

import React, { FormEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { VideoInfo } from '@/types';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';

interface SearchConverterCardProps {
  query: string;
  onQueryChange: (text: string) => void;
  onClear: () => void;
  onPaste: () => void;
  videoPreview: VideoInfo | null;
  isSearching: boolean;
  isConverting: boolean;
  visualizerActive: boolean;
  onSubmit: () => void;
}

export const SearchConverterCard: React.FC<SearchConverterCardProps> = ({
  query,
  onQueryChange,
  onClear,
  onPaste,
  videoPreview,
  isSearching,
  isConverting,
  visualizerActive,
  onSubmit,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const isLoading = isSearching || isConverting;
  const buttonText = isConverting
    ? 'Mastering 320kbps Audio...'
    : isSearching
    ? 'Searching...'
    : 'Search';

  return (
    <section className="glass-panel glass-panel-glow converter-card">
      <form onSubmit={handleSubmit} className="input-group-container">
        <div className="input-label-row">
          <label htmlFor="urlInput">Song Title or Media Link</label>
          <span>Auto-detects queries &amp; links</span>
        </div>

        <div className="input-wrapper">
          <svg
            className="input-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            type="text"
            id="urlInput"
            className="url-input"
            placeholder="Search..."
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="input-actions">
            {query && (
              <button
                type="button"
                className="btn-icon-action"
                onClick={onClear}
                title="Clear search input"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="btn-icon-action"
              onClick={onPaste}
              title="Paste from clipboard"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Paste
            </button>
          </div>
        </div>
      </form>

      {/* Video Preview Card when typing a direct link */}
      {videoPreview && (
        <div className="video-preview-card">
          <Image
            src={videoPreview.thumbnail}
            alt={videoPreview.title}
            width={80}
            height={48}
            className="video-preview-thumb"
            unoptimized
          />
          <div className="video-preview-info">
            <div className="video-preview-title" title={videoPreview.title}>
              {videoPreview.title}
            </div>
            <div className="video-preview-channel">{videoPreview.author}</div>
          </div>
        </div>
      )}

      {/* Format & Quality Options */}
      <div className="options-row">
        <div className="format-badge-group">
          <div className="format-pill">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            MP3 Audio Master
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Bitrate: <code>320 kbps High-Fidelity</code>
        </div>
      </div>

      {/* Live Waveform Visualizer */}
      <AudioWaveVisualizer isActive={visualizerActive} />

      {/* Main Search Action Button */}
      <button
        type="button"
        className="btn-shift-trigger"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="spinner" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        <span>{buttonText}</span>
      </button>
    </section>
  );
};
