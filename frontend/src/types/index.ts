export interface TrackResult {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

export interface VideoInfo {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  url: string;
}

export interface ConversionResult {
  success: boolean;
  filename: string;
  size: number;
  downloadUrl: string;
  blob?: Blob;
}

export interface HealthStatus {
  online: boolean;
  status?: number;
  error?: string;
  service?: string;
  version?: string;
}

export type ToastType = 'info' | 'success' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface PipelineStep {
  id: number;
  text: string;
}
