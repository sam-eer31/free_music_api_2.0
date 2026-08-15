import fs from 'fs';
import path from 'path';

export class TmpfilesService {
  /**
   * Uploads a local file to tmpfiles.org and returns the direct 48-hour download link.
   * tmpfiles API: POST https://tmpfiles.org/api/v1/upload
   * Response: { status: "success", data: { url: "https://tmpfiles.org/12345/song.mp3" } }
   * Direct download link: https://tmpfiles.org/dl/12345/song.mp3
   */
  static async uploadFile(filePath, customFilename) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found on disk: ${filePath}`);
    }

    const filename = customFilename || path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'audio/mpeg' });

    const formData = new FormData();
    formData.append('file', blob, filename);

    console.log(`[Tmpfiles] Uploading "${filename}" (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB) to tmpfiles.org...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s max upload timeout

    try {
      const response = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`tmpfiles.org upload failed (${response.status}): ${errText}`);
      }

      const result = await response.json();
      if (result.status !== 'success' || !result.data?.url) {
        throw new Error(`tmpfiles.org returned invalid response: ${JSON.stringify(result)}`);
      }

      const rawUrl = result.data.url;
      // Transform https://tmpfiles.org/12345/filename into direct download https://tmpfiles.org/dl/12345/filename
      const directUrl = rawUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

      console.log(`[Tmpfiles] Successfully uploaded: ${directUrl}`);

      return {
        success: true,
        originalUrl: rawUrl,
        downloadUrl: directUrl,
        expiresIn: '48 Hours',
        uploadedAt: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[Tmpfiles Upload Error]:', err.message);
      throw err;
    }
  }
}
