/**
 * crisper Audio Core API Client
 * Handles high-speed audio search, mastering, and streaming
 */

const DEFAULT_API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : 'https://free-music-downloader.onrender.com';

export class ApiClient {
  constructor() {
    this.baseUrl = (window.APP_ENV && window.APP_ENV.BACKEND_URL) 
      ? window.APP_ENV.BACKEND_URL.replace(/\/+$/, '')
      : DEFAULT_API_URL;
  }

  /**
   * Health check to detect if Render backend is awake
   */
  async checkHealth() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (response.ok) {
        const data = await response.json();
        return { online: true, ...data };
      }
      return { online: false, status: response.status };
    } catch (err) {
      clearTimeout(timeout);
      return { online: false, error: err.message };
    }
  }

  /**
   * Search top 7-8 audio choices
   */
  async searchTracks(query) {
    const res = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch search results (${res.status})`);
    }
    const data = await res.json();
    return data.results || [];
  }

  /**
   * Parse YouTube Video ID from any standard URL
   */
  static extractYouTubeId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Fetch video metadata (Title, Author, Thumbnail) using YouTube oEmbed / Backend
   */
  async getVideoInfo(youtubeUrl) {
    const videoId = ApiClient.extractYouTubeId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL format');
    }

    // Fast client-side oEmbed query with backend fallback
    try {
      const oEmbedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
      const res = await fetch(oEmbedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          return {
            videoId,
            title: data.title,
            author: data.author_name || 'YouTube Creator',
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      videoId,
      title: `YouTube Video (${videoId})`,
      author: 'YouTube Audio',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  /**
   * Trigger Conversion & Download Stream
   */
  async requestConversion(youtubeUrl, options = {}, onProgress = () => {}) {
    onProgress(1, 'Connecting to Render backend engine...');

    const res = await fetch(`${this.baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: youtubeUrl,
        format: options.format || 'mp3',
        quality: options.quality || '128k'
      })
    });

    if (!res.ok) {
      let errorMsg = 'Conversion failed';
      try {
        const errJson = await res.json();
        errorMsg = errJson.message || errorMsg;
      } catch {
        errorMsg = `Server error (${res.status} ${res.statusText})`;
      }
      throw new Error(errorMsg);
    }

    // Inspect content disposition header for filename
    const disposition = res.headers.get('Content-Disposition');
    let filename = 'audio_track.mp3';
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '');
      }
    }

    onProgress(5, 'Receiving MP3 audio stream...');
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename,
      size: blob.size,
      downloadUrl,
      blob
    };
  }
}
