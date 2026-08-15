import fs from 'fs';
import { musicEngine } from '../services/musicEngine.js';

export class ConvertController {
  /**
   * Health Check Handler
   */
  static health(req, res) {
    return res.status(200).json({
      status: 'healthy',
      engine: 'crisper 320kbps Music Engine',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  /**
   * Search Tracks Endpoint - Returns top 7-8 results
   */
  static async search(req, res) {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    console.log(`[Controller] Search request for: "${q}"`);
    try {
      const results = await musicEngine.searchTracks(q.trim(), 8);
      return res.status(200).json({
        success: true,
        query: q.trim(),
        count: results.length,
        results
      });
    } catch (err) {
      console.error('[Controller Search Error]:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to search tracks'
      });
    }
  }

  /**
   * Single Video / Song Info Validation & Details
   */
  static async getInfo(req, res) {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'URL or Song query parameter is required' });
    }

    try {
      const videoId = await musicEngine.resolveVideoId(url);
      return res.status(200).json({
        valid: true,
        videoId,
        standardUrl: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      });
    } catch {
      return res.status(200).json({
        valid: true,
        query: url,
        thumbnail: 'https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg'
      });
    }
  }

  /**
   * Main Conversion & 320kbps Download Stream Handler
   */
  static async convert(req, res) {
    const { url, query, id } = req.body;
    const targetInput = id || url || query;

    if (!targetInput) {
      return res.status(400).json({ message: 'Missing "id", "url" or "query" in request body' });
    }

    console.log(`[Controller] Starting 320kbps conversion job for: "${targetInput}"`);

    try {
      // Execute 320kbps shift automation
      const result = await musicEngine.download320k(targetInput, '320kbps');

      if (!fs.existsSync(result.filePath)) {
        throw new Error('Downloaded file was not found on disk');
      }

      console.log(`[Controller] Streaming ${result.filename} to client...`);

      // Set headers for file stream with RFC 5987 clean filename
      const cleanName = result.filename;
      const safeAscii = cleanName.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '');
      const encodedUtf8 = encodeURIComponent(cleanName);

      res.setHeader('Content-Disposition', `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodedUtf8}`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', result.size);

      // Stream file to response
      const fileStream = fs.createReadStream(result.filePath);

      fileStream.pipe(res);

      fileStream.on('close', () => {
        console.log(`[Controller] Stream finished for ${result.filename}. File preserved at: ${result.filePath}`);
      });

      fileStream.on('error', (streamErr) => {
        console.error('[Controller] File stream error:', streamErr);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error streaming downloaded file' });
        }
      });
    } catch (err) {
      console.error('[Controller Error]:', err.message);
      if (!res.headersSent) {
        return res.status(500).json({
          message: err.message || 'Failed to download 320kbps audio',
          error: true
        });
      }
    }
  }
}
