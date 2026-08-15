import { musicEngine, MusicEngineService } from '../services/musicEngine.js';

export class ApiV1Controller {
  /**
   * Health & Status Check
   */
  static health(req, res) {
    return res.status(200).json({
      status: 'healthy',
      api: 'Crisper Public Audio API v1',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  /**
   * Search Tracks Endpoint
   * GET /api/v1/search?q=song_name
   */
  static async search(req, res) {
    const q = req.query.q || req.query.query || req.query.input;
    if (!q || !String(q).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter "q" (or "input")'
      });
    }

    try {
      const results = await musicEngine.searchTracks(String(q).trim(), 8);
      return res.status(200).json({
        success: true,
        query: String(q).trim(),
        count: results.length,
        results
      });
    } catch (err) {
      console.error('[API v1 Search Error]:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to search tracks'
      });
    }
  }

  /**
   * Track / Media Info Validation
   * GET /api/v1/info?input=url_or_query
   */
  static async getInfo(req, res) {
    const targetInput = req.query.input || req.query.url || req.query.q;
    if (!targetInput) {
      return res.status(400).json({
        success: false,
        error: 'Missing query parameter "input" or "url"'
      });
    }

    try {
      const videoId = await musicEngine.resolveVideoId(String(targetInput).trim());
      return res.status(200).json({
        success: true,
        videoId,
        standardUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      });
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: err.message || 'Audio source could not be resolved'
      });
    }
  }

  /**
   * Unified Query / Link Handler
   * GET /api/v1/unified?input=... OR POST /api/v1/unified
   * - If input is a search query -> returns search results
   * - If input is a direct link or video ID -> processes 5-stage download to tmpfiles
   */
  static async unified(req, res) {
    const targetInput = req.body?.input || req.query?.input || req.body?.q || req.query?.q || req.body?.url || req.query?.url;
    if (!targetInput || !String(targetInput).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing "input" parameter in request body or query string'
      });
    }

    const trimmed = String(targetInput).trim();
    const isDirectIdOrUrl = MusicEngineService.extractVideoId(trimmed);

    if (isDirectIdOrUrl) {
      // Direct processing to 48h tmpfiles
      try {
        console.log(`[API v1 Unified] Direct processing for: "${trimmed}"`);
        const result = await musicEngine.downloadAndUploadToTmpfiles(trimmed, '320kbps');
        return res.status(200).json({
          type: 'download',
          ...result
        });
      } catch (err) {
        console.error('[API v1 Unified Error]:', err.message);
        return res.status(500).json({
          success: false,
          type: 'download',
          error: err.message || 'Failed to process audio stream'
        });
      }
    } else {
      // Search query
      try {
        console.log(`[API v1 Unified] Search query: "${trimmed}"`);
        const results = await musicEngine.searchTracks(trimmed, 8);
        return res.status(200).json({
          type: 'search',
          success: true,
          query: trimmed,
          count: results.length,
          results
        });
      } catch (err) {
        console.error('[API v1 Unified Search Error]:', err.message);
        return res.status(500).json({
          success: false,
          type: 'search',
          error: err.message || 'Failed to search tracks'
        });
      }
    }
  }

  /**
   * Real-Time 5-Stage Progress Stream (Server-Sent Events / SSE)
   * GET /api/v1/stream?input=url_or_id
   */
  static async streamProgress(req, res) {
    const targetInput = req.query.input || req.query.url || req.query.id || req.query.q;
    const quality = req.query.quality || '320kbps';

    if (!targetInput || !String(targetInput).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter "input" (or "url", "id")'
      });
    }

    const cleanInput = String(targetInput).trim();

    // Set Server-Sent Events (SSE) headers
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
      console.log(`[API v1 SSE] Starting 5-stage stream for: "${cleanInput}"`);
      
      const finalResult = await musicEngine.downloadAndUploadToTmpfiles(
        cleanInput,
        quality,
        (step, stage, message, data) => {
          sendEvent(step, stage, message, data);
        }
      );

      // Final complete event
      sendEvent(5, 'completed', 'Audio stream container ready!', finalResult);
      res.write('event: end\ndata: {}\n\n');
      res.end();
    } catch (err) {
      console.error('[API v1 SSE Error]:', err.message);
      sendEvent(0, 'error', err.message || 'An error occurred during audio processing', {
        error: true,
        details: err.message
      });
      res.write('event: error\ndata: {}\n\n');
      res.end();
    }
  }

  /**
   * Standard Synchronous REST Processing Endpoint
   * POST /api/v1/process OR GET /api/v1/process?input=...
   */
  static async process(req, res) {
    const targetInput = req.body?.input || req.query?.input || req.body?.url || req.query?.url || req.body?.id || req.query?.id;
    const quality = req.body?.quality || req.query?.quality || '320kbps';

    if (!targetInput || !String(targetInput).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required "input" (or "url", "id") in request'
      });
    }

    const cleanInput = String(targetInput).trim();
    console.log(`[API v1 REST] Processing audio request for: "${cleanInput}"`);

    try {
      const result = await musicEngine.downloadAndUploadToTmpfiles(cleanInput, quality);
      return res.status(200).json(result);
    } catch (err) {
      console.error('[API v1 REST Error]:', err.message);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to process and upload audio stream'
      });
    }
  }
}
