import { musicEngine, MusicEngineService } from '../services/musicEngine.js';

export class ApiV1Controller {
  /**
   * Single Unified Audio API Endpoint
   * GET /api/v1/audio?input=song_name_or_url OR POST /api/v1/audio
   */
  static async handleAudio(req, res) {
    const rawInput = req.query?.input || req.query?.q || req.query?.url || req.body?.input || req.body?.q || req.body?.url;

    if (!rawInput || !String(rawInput).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter "input" (e.g., ?input=song_name or ?input=youtube_url)'
      });
    }

    const input = String(rawInput).trim();
    const directVideoId = MusicEngineService.extractVideoId(input);

    if (directVideoId) {
      // 1. Direct link or video ID -> Convert and upload to tmpfiles (48h)
      console.log(`[API v1] Processing 48h download for: "${input}"`);
      try {
        const result = await musicEngine.downloadAndUploadToTmpfiles(input, '320kbps');
        return res.status(200).json({
          type: 'download',
          ...result
        });
      } catch (err) {
        console.error('[API v1 Download Error]:', err.message);
        return res.status(500).json({
          success: false,
          type: 'download',
          error: err.message || 'Failed to process audio stream'
        });
      }
    } else {
      // 2. Search query -> Return top matching tracks
      console.log(`[API v1] Searching tracks for: "${input}"`);
      try {
        const results = await musicEngine.searchTracks(input, 8);
        return res.status(200).json({
          type: 'search',
          success: true,
          query: input,
          count: results.length,
          results
        });
      } catch (err) {
        console.error('[API v1 Search Error]:', err.message);
        return res.status(500).json({
          success: false,
          type: 'search',
          error: err.message || 'Failed to search tracks'
        });
      }
    }
  }
}
