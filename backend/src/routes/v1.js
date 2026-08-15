import express from 'express';
import { ApiV1Controller } from '../controllers/apiV1Controller.js';

const router = express.Router();

// Health Check
router.get('/health', ApiV1Controller.health);

// Multi-Track Search
router.get('/search', ApiV1Controller.search);

// Metadata & Video Info
router.get('/info', ApiV1Controller.getInfo);

// Unified Query / Link Router
router.get('/unified', ApiV1Controller.unified);
router.post('/unified', ApiV1Controller.unified);

// Real-Time 5-Stage Progress Stream (Server-Sent Events)
router.get('/stream', ApiV1Controller.streamProgress);

// Standard Synchronous REST Processing (Returns 48h tmpfiles download link)
router.get('/process', ApiV1Controller.process);
router.post('/process', ApiV1Controller.process);

export default router;
