'use client';

import React from 'react';

interface StatusPillProps {
  status: 'waking' | 'online' | 'offline';
  text: string;
  onClick: () => void;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, text, onClick }) => {
  return (
    <button
      type="button"
      className="backend-status-pill"
      onClick={onClick}
      title="Click to check Audio Engine Status"
    >
      <span className={`status-dot ${status}`} />
      <span>{text}</span>
    </button>
  );
};
