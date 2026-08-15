/**
 * UI State and DOM Manager
 */

export class UIManager {
  constructor() {
    this.elements = {
      // Inputs & Buttons
      urlInput: document.getElementById('urlInput'),
      btnPaste: document.getElementById('btnPaste'),
      btnClear: document.getElementById('btnClear'),
      btnShift: document.getElementById('btnShift'),
      btnShiftText: document.getElementById('btnShiftText'),
      btnShiftSpinner: document.getElementById('btnShiftSpinner'),

      // Cards & Panels
      searchResultsPanel: document.getElementById('searchResultsPanel'),
      searchResultsList: document.getElementById('searchResultsList'),
      resultsCountBadge: document.getElementById('resultsCountBadge'),
      videoPreviewCard: document.getElementById('videoPreviewCard'),
      pipelineCard: document.getElementById('pipelineCard'),
      resultCard: document.getElementById('resultCard'),

      // Video Preview elements
      previewThumb: document.getElementById('previewThumb'),
      previewTitle: document.getElementById('previewTitle'),
      previewChannel: document.getElementById('previewChannel'),

      // Pipeline & Stepper
      pipelineStatusText: document.getElementById('pipelineStatusText'),
      pipelinePercent: document.getElementById('pipelinePercent'),
      stepperItems: document.querySelectorAll('.stepper-item'),

      // Result elements
      resultTitle: document.getElementById('resultTitle'),
      resultFileSize: document.getElementById('resultFileSize'),
      resultFormatBadge: document.getElementById('resultFormatBadge'),
      btnDownloadFinal: document.getElementById('btnDownloadFinal'),
      btnConvertAnother: document.getElementById('btnConvertAnother'),

      // Status Pill & Modal
      backendStatusPill: document.getElementById('backendStatusPill'),
      backendStatusDot: document.getElementById('backendStatusDot'),
      backendStatusText: document.getElementById('backendStatusText'),

      toastContainer: document.getElementById('toastContainer')
    };

    this.steps = [
      { id: 1, text: 'Connecting to crisper Audio Core...' },
      { id: 2, text: 'Analyzing audio spectrum & sample rate...' },
      { id: 3, text: 'Mastering 320kbps high-fidelity audio stream...' },
      { id: 4, text: 'Packaging MP3 audio container...' },
      { id: 5, text: 'Audio stream ready for download!' }
    ];
  }

  showToast(message, type = 'info', duration = 4000) {
    if (!this.elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  setBackendStatus(status, text) {
    if (!this.elements.backendStatusDot) return;
    this.elements.backendStatusDot.className = `status-dot ${status}`;
    this.elements.backendStatusText.textContent = text;
  }

  renderSearchResults(tracks, onSelectTrack) {
    if (!this.elements.searchResultsPanel || !this.elements.searchResultsList) return;
    
    this.elements.searchResultsList.innerHTML = '';
    this.elements.resultsCountBadge.textContent = `${tracks.length} Choice${tracks.length === 1 ? '' : 's'}`;

    tracks.forEach((track) => {
      const card = document.createElement('div');
      card.className = 'track-item-card';

      card.innerHTML = `
        <div class="track-thumb-wrap">
          <img src="${track.thumbnail}" alt="${track.title}" class="track-thumb-img" loading="lazy" />
          <span class="track-duration-pill">${track.duration}</span>
        </div>
        <div class="track-meta">
          <div class="track-title" title="${track.title}">${track.title}</div>
          <div class="track-channel">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <span>${track.channel}</span>
          </div>
        </div>
        <button type="button" class="btn-track-download">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>320k MP3</span>
        </button>
      `;

      card.addEventListener('click', () => {
        onSelectTrack(track);
      });

      this.elements.searchResultsList.appendChild(card);
    });

    this.elements.searchResultsPanel.classList.add('visible');
    this.elements.searchResultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  hideSearchResults() {
    if (this.elements.searchResultsPanel) {
      this.elements.searchResultsPanel.classList.remove('visible');
      if (this.elements.searchResultsList) {
        this.elements.searchResultsList.innerHTML = '';
      }
    }
  }

  showVideoPreview(info) {
    if (!this.elements.videoPreviewCard) return;
    this.elements.previewThumb.src = info.thumbnail;
    this.elements.previewTitle.textContent = info.title;
    this.elements.previewChannel.textContent = info.author;
    this.elements.videoPreviewCard.classList.add('visible');
  }

  hideVideoPreview() {
    if (this.elements.videoPreviewCard) {
      this.elements.videoPreviewCard.classList.remove('visible');
    }
  }

  setLoadingState(loading) {
    if (!this.elements.btnShift) return;
    this.elements.btnShift.disabled = loading;
    if (loading) {
      this.elements.btnShiftSpinner.style.display = 'block';
      this.elements.btnShiftText.textContent = 'Mastering 320kbps Audio...';
      this.elements.pipelineCard.classList.add('visible');
      this.elements.resultCard.classList.remove('visible');
    } else {
      this.elements.btnShiftSpinner.style.display = 'none';
      this.elements.btnShiftText.textContent = 'Download 320kbps Audio';
    }
  }

  updatePipelineStep(stepNumber, customMessage = null) {
    const totalSteps = 5;
    const percent = Math.round((stepNumber / totalSteps) * 100);
    
    if (this.elements.pipelinePercent) {
      this.elements.pipelinePercent.textContent = `${percent}%`;
    }

    const stepObj = this.steps.find((s) => s.id === stepNumber);
    if (this.elements.pipelineStatusText && stepObj) {
      this.elements.pipelineStatusText.textContent = customMessage || stepObj.text;
    }

    this.elements.stepperItems.forEach((item, index) => {
      const stepIdx = index + 1;
      item.classList.remove('active', 'completed');
      if (stepIdx < stepNumber) {
        item.classList.add('completed');
      } else if (stepIdx === stepNumber) {
        item.classList.add('active');
      }
    });
  }

  showResult(result) {
    this.elements.pipelineCard.classList.remove('visible');
    this.elements.resultCard.classList.add('visible');

    this.elements.resultTitle.textContent = result.filename;
    
    // Format file size
    const sizeInMb = (result.size / (1024 * 1024)).toFixed(2);
    this.elements.resultFileSize.textContent = `${sizeInMb} MB`;
    this.elements.resultFormatBadge.textContent = 'MP3 (Audio)';

    this.elements.btnDownloadFinal.href = result.downloadUrl;
    this.elements.btnDownloadFinal.setAttribute('download', result.filename);

    // Automatically trigger the download
    const tempLink = document.createElement('a');
    tempLink.href = result.downloadUrl;
    tempLink.download = result.filename;
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();

    this.showToast('Download started automatically!', 'success');
  }

  resetForm() {
    this.elements.pipelineCard.classList.remove('visible');
    this.elements.resultCard.classList.remove('visible');
    this.elements.urlInput.value = '';
    this.hideVideoPreview();
    this.setLoadingState(false);
  }
}
