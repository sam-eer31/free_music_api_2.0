'use client';

import React from 'react';
import { PipelineStep } from '@/types';

const STEPS: PipelineStep[] = [
  { id: 1, text: 'Connecting to crisper Audio Core' },
  { id: 2, text: 'Analyzing Audio Spectrum & Sample Rate' },
  { id: 3, text: 'Mastering 320kbps Studio-Quality Stream' },
  { id: 4, text: 'Packaging MP3 Audio Container' },
  { id: 5, text: 'Deliver Stream to Browser' },
];

interface PipelineStepperProps {
  currentStep: number;
  customMessage: string | null;
  isVisible: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStep,
  customMessage,
  isVisible,
}) => {
  if (!isVisible) return null;

  const totalSteps = 5;
  const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  const activeStepObj = STEPS.find((s) => s.id === currentStep);
  const statusDisplay = customMessage || activeStepObj?.text || 'Processing Audio Stream...';

  return (
    <section className="glass-panel pipeline-card">
      <div className="pipeline-header">
        <div className="pipeline-title">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="var(--c-rose-coral)"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{statusDisplay}</span>
        </div>
        <div className="pipeline-percentage">{percent}%</div>
      </div>

      <div className="stepper-list">
        {STEPS.map((step) => {
          let stepClass = 'stepper-item';
          if (step.id < currentStep) {
            stepClass += ' completed';
          } else if (step.id === currentStep) {
            stepClass += ' active';
          }

          return (
            <div key={step.id} className={stepClass}>
              <div className="step-icon-wrap">{step.id}</div>
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
