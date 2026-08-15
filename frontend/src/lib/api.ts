import { ConversionResult, HealthStatus, TrackResult, VideoInfo } from '@/types';

export class ApiClient {
  private baseUrl: string;

  constructor(customUrl?: string) {
    if (customUrl) {
      this.baseUrl = customUrl.replace(/\/+$/, '');
    } else if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
    } else if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        this.baseUrl = 'http://localhost:3000';
      } else {
        this.baseUrl = 'https://free-music-downloader.onrender.com';
      }
    } else {
      this.baseUrl = 'https://free-music-downloader.onrender.com';
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
  }

  /**
   * Health check to detect if Render backend is awake
   */
  async checkHealth(): Promise<HealthStatus> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.ok) {
        const data = await response.json();
        return { online: true, ...data };
      }
      return { online: false, status: response.status };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { online: false, error: errorMessage };
    }
  }

  /**
   * Search top audio choices
   */
  async searchTracks(query: string): Promise<TrackResult[]> {
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
  static extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Fetch video metadata (Title, Author, Thumbnail) using YouTube oEmbed / Backend
   */
  async getVideoInfo(youtubeUrl: string): Promise<VideoInfo> {
    const videoId = ApiClient.extractYouTubeId(youtubeUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL format');
    }

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
            url: `https://www.youtube.com/watch?v=${videoId}`,
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
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  /**
   * Trigger Conversion & Download Stream
   */
  async requestConversion(
    youtubeUrlOrId: string,
    options: { format?: string; quality?: string } = {},
    onProgress: (step: number, msg: string) => void = () => {}
  ): Promise<ConversionResult> {
    onProgress(1, 'Connecting to audio engine backend...');

    const res = await fetch(`${this.baseUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: youtubeUrlOrId,
        format: options.format || 'mp3',
        quality: options.quality || '320kbps',
      }),
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

    onProgress(5, 'Receiving 320kbps MP3 audio stream...');
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);

    return {
      success: true,
      filename,
      size: blob.size,
      downloadUrl,
      blob,
    };
  }
}

export const defaultApiClient = new ApiClient();
