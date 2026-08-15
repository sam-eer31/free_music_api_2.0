'use client';

import React, { useRef, useEffect } from 'react';

interface AudioWaveVisualizerProps {
  isActive: boolean;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : (container.clientWidth || 320);
      const height = rect.height > 0 ? rect.height : (container.clientHeight || 64);
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile performance

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Instantly redraw frame if not animating
      if (!isActive) {
        drawFrame(false, width, height);
      }
    };

    const drawFrame = (active: boolean, w?: number, h?: number) => {
      const rect = container.getBoundingClientRect();
      const width = w || (rect.width > 0 ? rect.width : (container.clientWidth || 320));
      const height = h || (rect.height > 0 ? rect.height : (container.clientHeight || 64));
      const centerY = height / 2;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      ctx.clearRect(0, 0, width, height);
      stepRef.current += active ? 0.06 : 0.02;
      const step = stepRef.current;

      if (!active) {
        // Gentle ambient breathing wave in Crimson tint
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x <= width; x += 4) {
          const sine = Math.sin(x * 0.025 + step) * 3.5;
          const noise = Math.cos(x * 0.01 - step * 0.5) * 1.5;
          const y = centerY + sine + noise;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = isLight ? 'rgba(203, 41, 87, 0.65)' : 'rgba(203, 41, 87, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Subtle secondary harmonic
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x <= width; x += 6) {
          const y = centerY + Math.sin(x * 0.015 - step * 0.8) * 2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(221, 221, 221, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        return;
      }

      // Active energetic audio mastering harmonics
      const waves = [
        { freq: 0.02, amp: 16, speed: 1.0, color: 'rgba(203, 41, 87, 0.95)', width: 2.5 },
        { freq: 0.035, amp: 11, speed: 1.4, color: isLight ? 'rgba(0, 0, 0, 0.40)' : 'rgba(221, 221, 221, 0.85)', width: 2.0 },
        { freq: 0.015, amp: 20, speed: 0.7, color: isLight ? 'rgba(203, 41, 87, 0.35)' : 'rgba(238, 238, 238, 0.65)', width: 1.5 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, centerY);

        for (let x = 0; x <= width; x += 3) {
          const sine = Math.sin(x * wave.freq + step * wave.speed);
          const noise = Math.cos(x * 0.01 - step * 0.5) * 4;
          const y = centerY + (sine * wave.amp + noise);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.width;
        ctx.stroke();
      });
    };

    const animateLoop = () => {
      drawFrame(isActive);
      animationRef.current = requestAnimationFrame(animateLoop);
    };

    // Initial sizing
    resize();

    // Use ResizeObserver to continuously handle mobile viewport / flex resizing
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }

    // Run continuous animation loop
    animationRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="visualizer-container"
      aria-label="Audio Waveform Visualizer"
    >
      <canvas ref={canvasRef} className="audio-visualizer-canvas" />
    </div>
  );
};
