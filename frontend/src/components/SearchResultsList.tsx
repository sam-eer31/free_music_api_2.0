'use client';

import React from 'react';
import Image from 'next/image';
import { TrackResult } from '@/types';

interface SearchResultsListProps {
  tracks: TrackResult[];
  onSelectTrack: (track: TrackResult) => void;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({ tracks, onSelectTrack }) => {
  if (!tracks || tracks.length === 0) return null;

  return (
    <section className="glass-panel search-results-panel">
      <div className="results-header-row">
        <div className="results-heading">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="var(--c-crimson)"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
            />
          </svg>
          <span>Select Track to Master (320kbps)</span>
        </div>
        <span className="results-count-badge">
          {tracks.length} Choice{tracks.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="results-list">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            id={index === 0 ? 'firstTrackChoice' : undefined}
            type="button"
            className="track-item-card"
            onClick={() => onSelectTrack(track)}
          >
            <div className="track-thumb-wrap">
              <Image
                src={track.thumbnail}
                alt={track.title}
                width={90}
                height={52}
                className="track-thumb-img"
                unoptimized
              />
              <span className="track-duration-pill">{track.duration}</span>
            </div>

            <div className="track-meta">
              <div className="track-title" title={track.title}>
                {track.title}
              </div>
              <div className="track-channel">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span>{track.channel}</span>
              </div>
            </div>

            <div className="btn-track-download">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>320k MP3</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
