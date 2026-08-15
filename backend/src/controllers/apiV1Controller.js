import { musicEngine, MusicEngineService } from '../services/musicEngine.js';

export class ApiV1Controller {
  /**
   * Single Unified Audio API Endpoint
   * GET /api/v1/audio?input=song_name_or_url[&stream=true] OR POST /api/v1/audio
   */
  static async handleAudio(req, res) {
    const rawInput =
      req.query?.input ||
      req.query?.q ||
      req.query?.url ||
      req.body?.input ||
      req.body?.q ||
      req.body?.url;

    const isStream =
      String(req.query?.stream || req.body?.stream || '').toLowerCase() === 'true';

    if (!rawInput || !String(rawInput).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter "input" (e.g., ?input=song_name or ?input=youtube_url)'
      });
    }

    const input = String(rawInput).trim();
    const directVideoId = MusicEngineService.extractVideoId(input);

    if (directVideoId) {
      // 1. Direct Link or Video ID -> Convert and upload to tmpfiles (48h)
      if (isStream) {
        // --- SSE Real-Time 5-Stage Stream ---
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.flushHeaders?.();

        const sendEvent = (step, stage, message, data = null) => {
          const payload = {
            step,
            stage,
            message,
            timestamp: new Date().toISOString(),
            ...(data ? { data } : {})
          };
          res.write(`data: ${JSON.stringify(payload)}\n\n`);
        };

        try {
          console.log(`[API v1 SSE] Starting 5-stage stream for: "${input}"`);
          const result = await musicEngine.downloadAndUploadToTmpfiles(
            input,
            '320kbps',
            (step, stage, message, data) => {
              sendEvent(step, stage, message, data);
            }
          );
          sendEvent(5, 'completed', 'Audio stream container ready!', result);
          res.write('event: end\ndata: {}\n\n');
          res.end();
        } catch (err) {
          console.error('[API v1 SSE Error]:', err.message);
          sendEvent(0, 'error', err.message || 'Failed to process audio stream', {
            error: true,
            details: err.message
          });
          res.write('event: error\ndata: {}\n\n');
          res.end();
        }
      } else {
        // --- Standard Synchronous REST Response ---
        console.log(`[API v1 REST] Processing 48h download for: "${input}"`);
        try {
          const result = await musicEngine.downloadAndUploadToTmpfiles(input, '320kbps');
          return res.status(200).json({
            type: 'download',
            ...result
          });
        } catch (err) {
          console.error('[API v1 REST Error]:', err.message);
          return res.status(500).json({
            success: false,
            type: 'download',
            error: err.message || 'Failed to process audio stream'
          });
        }
      }
    } else {
      // 2. Search Query -> Return Top Matching Tracks
      console.log(`[API v1 Search] Searching tracks for: "${input}"`);
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
