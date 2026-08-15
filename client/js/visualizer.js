/**
 * Live HTML5 Canvas Soundwave Visualizer
 * Rose, Blush & Warm Peach Glassmorphic Theme (#FBA1B7 -> #FFDBAA -> #FFD1DA)
 */

export class AudioWaveVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isActive = false;
    this.animationId = null;
    this.step = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.drawIdle();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  setActive(active) {
    this.isActive = active;
    if (active) {
      this.animate();
    } else {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.drawIdle();
    }
  }

  drawIdle() {
    if (!this.canvas) return;
    const width = this.canvas.getBoundingClientRect().width;
    const height = this.canvas.getBoundingClientRect().height;
    const centerY = height / 2;

    this.ctx.clearRect(0, 0, width, height);

    // Subtle ambient flatline wave in Rose Coral tint
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);

    for (let x = 0; x < width; x += 5) {
      const y = centerY + Math.sin(x * 0.03) * 3;
      this.ctx.lineTo(x, y);
    }

    this.ctx.strokeStyle = 'rgba(251, 161, 183, 0.35)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
  }

  animate() {
    if (!this.isActive || !this.canvas) return;

    const width = this.canvas.getBoundingClientRect().width;
    const height = this.canvas.getBoundingClientRect().height;
    const centerY = height / 2;

    this.ctx.clearRect(0, 0, width, height);
    this.step += 0.06;

    // Multi-layer sine waves with Rose Coral (#FBA1B7), Warm Peach (#FFDBAA), and Pastel Rose (#FFD1DA)
    const waves = [
      { freq: 0.02, amp: 16, speed: 1.0, color: 'rgba(251, 161, 183, 0.90)', width: 2.5 },
      { freq: 0.035, amp: 11, speed: 1.4, color: 'rgba(255, 219, 170, 0.85)', width: 2.0 },
      { freq: 0.015, amp: 20, speed: 0.7, color: 'rgba(255, 209, 218, 0.65)', width: 1.5 }
    ];

    waves.forEach((wave) => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x += 3) {
        const sine = Math.sin(x * wave.freq + this.step * wave.speed);
        const noise = Math.cos(x * 0.01 - this.step * 0.5) * 4;
        const y = centerY + (sine * wave.amp + noise);
        this.ctx.lineTo(x, y);
      }

      this.ctx.strokeStyle = wave.color;
      this.ctx.lineWidth = wave.width;
      this.ctx.stroke();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
