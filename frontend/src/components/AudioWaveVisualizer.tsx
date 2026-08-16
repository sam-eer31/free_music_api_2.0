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

    let canvasWidth = 800; // Safe default
    let canvasHeight = 64;

    const resize = () => {
      const newWidth = container.offsetWidth || container.clientWidth;
      const newHeight = container.offsetHeight || container.clientHeight;
      
      // CRITICAL FIX: During theme toggles or fast scrolling, the browser can temporarily
      // report 0 width due to layout thrashing. If we resize to 0 (or a fallback like 320),
      // the canvas buffer shrinks and permanently breaks until the next manual resize.
      // Solution: Ignore 0-dimension layout shifts.
      if (!newWidth || !newHeight) return;

      // Prevent unnecessary canvas wipes (which cause flickering) if size hasn't actually changed
      if (canvas.width > 0 && newWidth === canvasWidth && newHeight === canvasHeight) return;

      canvasWidth = newWidth;
      canvasHeight = newHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile performance

      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Instantly redraw frame to prevent blank canvas if rAF is suspended
      // Pass delta=0 so we don't accidentally fast-forward the animation!
      drawFrame(isActive, 0);
    };

    const drawFrame = (active: boolean, deltaMs: number = 16.66) => {
      const width = canvasWidth;
      const height = canvasHeight;
      const centerY = height / 2;
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      ctx.clearRect(0, 0, width, height);
      
      // Time-based animation step to ensure identical speed on 60Hz and 144Hz monitors
      // deltaMs=0 is used when forced redraws (resize/theme) occur, preventing animation jerks
      const timeScale = deltaMs / 16.66;
      stepRef.current += (active ? 0.06 : 0.02) * timeScale;
      
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

    let lastTime = performance.now();

    const animateLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Cap delta to 50ms (20fps fallback) to prevent huge skips if user switches tabs
      const safeDelta = Math.min(delta, 50);
      drawFrame(isActive, safeDelta);
      
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

    const themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          drawFrame(isActive, 0); // delta=0 prevents animation jerk
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

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
      themeObserver.disconnect();
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
