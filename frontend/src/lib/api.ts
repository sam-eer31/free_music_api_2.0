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
        this.baseUrl = 'https://crisper.onrender.com';
      }
    } else {
      this.baseUrl = 'https://crisper.onrender.com';
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
   * Parse YouTube Video ID from standard URL or direct 11-char ID
   */
  static extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regex);
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
    return new Promise((resolve, reject) => {
      onProgress(1, 'Connecting to real-time audio stream...');
      
      const sseUrl = `${this.baseUrl}/api/v1/audio?input=${encodeURIComponent(youtubeUrlOrId)}&stream=true`;
      const eventSource = new EventSource(sseUrl);
      
      let isCompleted = false;

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          if (payload.stage === 'error') {
            eventSource.close();
            reject(new Error(payload.message || 'Stream processing failed'));
            return;
          }

          if (payload.step) {
            onProgress(payload.step, payload.message || 'Processing...');
          }

          if (payload.stage === 'completed' && payload.data) {
            isCompleted = true;
            eventSource.close();
            
            // Fetch the file directly to create a seamless local download instead of navigating
            onProgress(5, 'Receiving audio stream to browser...');
            
            const proxyUrl = `${this.baseUrl}/api/proxy-download?url=${encodeURIComponent(payload.data.downloadUrl)}&filename=${encodeURIComponent(payload.data.filename)}`;
            
            fetch(proxyUrl)
              .then(res => {
                if (!res.ok) throw new Error('Failed to fetch from download URL');
                return res.blob();
              })
              .then(blob => {
                const localDownloadUrl = URL.createObjectURL(blob);
                resolve({
                  success: true,
                  filename: payload.data.filename,
                  size: payload.data.sizeBytes,
                  downloadUrl: localDownloadUrl,
                  blob,
                });
              })
              .catch(err => {
                console.error('Failed to fetch blob silently, falling back to direct link', err);
                resolve({
                  success: true,
                  filename: payload.data.filename,
                  size: payload.data.sizeBytes,
                  downloadUrl: proxyUrl, // use proxyUrl as fallback so it still forces attachment
                });
              });
          }
        } catch (e) {
          console.error("SSE parse error", e);
        }
      };

      eventSource.addEventListener('error', () => {
        if (!isCompleted) {
          eventSource.close();
          reject(new Error('Connection to real-time stream lost.'));
        }
      });
    });
  }
}

export const defaultApiClient = new ApiClient();
