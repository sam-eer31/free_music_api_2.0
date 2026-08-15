/**
 * Main Application Controller
 */

import { AudioWaveVisualizer } from './visualizer.js';
import { ApiClient } from './api.js';
import { UIManager } from './ui.js';

class App {
  constructor() {
    this.visualizer = new AudioWaveVisualizer('audioVisualizer');
    this.api = new ApiClient();
    this.ui = new UIManager();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkBackendHealth();
    setInterval(() => this.checkBackendHealth(), 30000);
  }

  async checkBackendHealth() {
    this.ui.setBackendStatus('waking', 'Checking Engine...');
    const result = await this.api.checkHealth();
    if (result.online) {
      this.ui.setBackendStatus('online', 'Engine Ready');
    } else {
      this.ui.setBackendStatus('offline', 'Engine Offline (Click to configure)');
    }
  }

  setupEventListeners() {
    const { elements } = this.ui;

    // Paste from clipboard button
    elements.btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          elements.urlInput.value = text.trim();
          this.handleUrlChange(text.trim());
          this.ui.showToast('Pasted from clipboard', 'info');
        }
      } catch {
        this.ui.showToast('Unable to read clipboard. Please paste manually.', 'error');
      }
    });

    // Clear input button
    elements.btnClear.addEventListener('click', () => {
      elements.urlInput.value = '';
      this.ui.hideVideoPreview();
      this.ui.hideSearchResults();
    });

    // URL input live change
    let debounceTimer;
    elements.urlInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.handleUrlChange(e.target.value.trim());
      }, 400);
    });

    // Main Shift Button Click
    elements.btnShift.addEventListener('click', () => {
      this.handleSearchOrConvert();
    });

    // Enter key inside input
    elements.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSearchOrConvert();
      }
    });

    // Convert Another Button Click
    elements.btnConvertAnother.addEventListener('click', () => {
      this.ui.resetForm();
      this.ui.hideSearchResults();
    });

    // Backend status pill click -> Re-check health
    elements.backendStatusPill.addEventListener('click', () => {
      this.checkBackendHealth();
      this.ui.showToast(`Checking engine at: ${this.api.baseUrl}`, 'info');
    });
  }

  async handleUrlChange(url) {
    if (!url) {
      this.ui.hideVideoPreview();
      return;
    }
    const videoId = ApiClient.extractYouTubeId(url);
    if (videoId) {
      try {
        const info = await this.api.getVideoInfo(url);
        this.ui.showVideoPreview(info);
      } catch {
        // Silent fallback
      }
    }
  }

  async handleSearchOrConvert() {
    const rawInput = this.ui.elements.urlInput.value.trim();
    if (!rawInput) {
      this.ui.showToast('Please enter a song title or media link', 'error');
      this.ui.elements.urlInput.focus();
      return;
    }

    const directId = ApiClient.extractYouTubeId(rawInput);
    
    // If it is a direct YouTube URL, convert immediately
    if (directId) {
      this.startDownloadTrack({ id: directId, title: `Track (${directId})` });
      return;
    }

    // Otherwise, perform search and show 7-8 choices
    this.ui.elements.btnShift.disabled = true;
    this.ui.elements.btnShiftSpinner.style.display = 'block';
    this.ui.elements.btnShiftText.textContent = 'Searching...';
    this.ui.hideSearchResults();

    try {
      const tracks = await this.api.searchTracks(rawInput);
      if (!tracks || tracks.length === 0) {
        this.ui.showToast(`No tracks found for "${rawInput}". Try another title.`, 'error');
        return;
      }

      this.ui.renderSearchResults(tracks, (selectedTrack) => {
        this.startDownloadTrack(selectedTrack);
      });

      this.ui.showToast(`Found ${tracks.length} matching tracks! Click any card to download 320kbps MP3.`, 'success');
    } catch (err) {
      this.ui.showToast(err.message || 'Search failed. Please check backend connection.', 'error');
    } finally {
      this.ui.elements.btnShift.disabled = false;
      this.ui.elements.btnShiftSpinner.style.display = 'none';
      this.ui.elements.btnShiftText.textContent = 'Search';
    }
  }

  async startDownloadTrack(track) {
    const trackId = track.id;
    const trackTitle = track.title;

    // Start Visualizer and UI loading states
    this.visualizer.setActive(true);
    this.ui.setLoadingState(true);
    this.ui.hideSearchResults();
    this.ui.updatePipelineStep(1, `Mastering 320kbps stream for "${trackTitle}"...`);

    // Progressive stepping feedback
    let currentStep = 1;
    const stepInterval = setInterval(() => {
      if (currentStep < 4) {
        currentStep++;
        this.ui.updatePipelineStep(currentStep);
      }
    }, 2200);

    try {
      const result = await this.api.requestConversion(
        trackId,
        { format: 'mp3', quality: '320kbps' },
        (step, msg) => {
          this.ui.updatePipelineStep(step, msg);
        }
      );

      clearInterval(stepInterval);
      this.ui.updatePipelineStep(5, 'Stream ready!');
      this.ui.showResult(result);
    } catch (err) {
      clearInterval(stepInterval);
      this.ui.showToast(err.message || 'An error occurred during audio mastering', 'error');
    } finally {
      this.visualizer.setActive(false);
      this.ui.setLoadingState(false);
    }
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
