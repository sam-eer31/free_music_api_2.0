'use client';

import React from 'react';
import { ConversionResult } from '@/types';

interface ResultCardProps {
  result: ConversionResult | null;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  if (!result) return null;

  const sizeInMb = (result.size / (1024 * 1024)).toFixed(2);

  // Clean and format display title
  let cleanTitle = result.filename;
  try {
    cleanTitle = decodeURIComponent(cleanTitle);
  } catch {}

  // Strip .mp3 extension for title card display
  let displayTitle = cleanTitle.replace(/\.mp3$/i, '');
  const parts = displayTitle.split(/\s*-\s*/);
  if (parts.length >= 3 && parts[0].toLowerCase().trim() === parts[parts.length - 1].toLowerCase().trim()) {
    parts.pop();
    displayTitle = parts.join(' - ');
  }

  const downloadFilename = `${displayTitle}.mp3`;

  return (
    <section className="glass-panel result-card">
      <div className="result-icon-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="result-title" title={displayTitle}>
        {displayTitle}
      </h3>

      <div className="result-file-details">
        <span>MP3 (320kbps)</span>
        <span>•</span>
        <span>{sizeInMb} MB</span>
      </div>

      <div className="result-actions-row">
        <a
          href={result.downloadUrl}
          download={downloadFilename}
          className="btn-download-final"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Save MP3
        </a>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Search Another
        </button>
      </div>
    </section>
  );
};
