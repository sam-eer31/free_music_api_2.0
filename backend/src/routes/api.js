import { Router } from 'express';
import { ConvertController } from '../controllers/convertController.js';

const router = Router();

// Health check endpoint
router.get('/health', ConvertController.health);

// Search 7-8 track choices
router.get('/search', ConvertController.search);

// Single video metadata & validation endpoint
router.get('/info', ConvertController.getInfo);

// Trigger 320kbps format shift and stream MP3
router.post('/convert', ConvertController.convert);

// Proxy tmpfiles download to bypass CORS
router.get('/proxy-download', ConvertController.proxyDownload);

export default router;
