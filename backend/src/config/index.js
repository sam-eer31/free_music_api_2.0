import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  tempDir: path.join(__dirname, '../../temp_downloads'),
  browserTimeout: parseInt(process.env.BROWSER_TIMEOUT || '60000', 10), // 60s max
  maxConcurrentBrowsers: parseInt(process.env.MAX_CONCURRENT || '2', 10), // 2 for Render 512MB RAM
};
