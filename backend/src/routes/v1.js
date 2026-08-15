import express from 'express';
import { ApiV1Controller } from '../controllers/apiV1Controller.js';

const router = express.Router();

// Single Unified Audio Endpoint
router.get('/audio', ApiV1Controller.handleAudio);
router.post('/audio', ApiV1Controller.handleAudio);

export default router;
