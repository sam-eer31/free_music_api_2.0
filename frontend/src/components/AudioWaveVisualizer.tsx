'use client';

import React, { useRef, useEffect } from 'react';

interface AudioWaveVisualizerProps {
  isActive: boolean;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawIdle = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Subtle ambient flatline wave in Rose Coral tint
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x += 5) {
        const y = centerY + Math.sin(x * 0.03) * 3;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = 'rgba(251, 161, 183, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      stepRef.current += 0.06;
      const step = stepRef.current;

      const waves = [
        { freq: 0.02, amp: 16, speed: 1.0, color: 'rgba(251, 161, 183, 0.90)', width: 2.5 },
        { freq: 0.035, amp: 11, speed: 1.4, color: 'rgba(255, 219, 170, 0.85)', width: 2.0 },
        { freq: 0.015, amp: 20, speed: 0.7, color: 'rgba(255, 209, 218, 0.65)', width: 1.5 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x < width; x += 3) {
          const sine = Math.sin(x * wave.freq + step * wave.speed);
          const noise = Math.cos(x * 0.01 - step * 0.5) * 4;
          const y = centerY + (sine * wave.amp + noise);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      drawIdle();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <div className="visualizer-container" aria-label="Audio Waveform Visualizer">
      <canvas ref={canvasRef} className="audio-visualizer-canvas" />
    </div>
  );
};
