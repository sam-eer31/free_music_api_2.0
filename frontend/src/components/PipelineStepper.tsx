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
            stroke="var(--c-crimson)"
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
              <div className="step-icon-wrap">
                {step.id < currentStep ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : step.id === currentStep ? (
                  <svg className="spinner-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                    <style>{`
                      .spinner-icon {
                        animation: spin 1s linear infinite;
                      }
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
