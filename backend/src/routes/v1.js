import express from 'express';
import { ApiV1Controller } from '../controllers/apiV1Controller.js';

const router = express.Router();

// Primary Process Endpoint
router.get('/process', ApiV1Controller.handleAudio);
router.post('/process', ApiV1Controller.handleAudio);

// Alias
router.get('/audio', ApiV1Controller.handleAudio);
router.post('/audio', ApiV1Controller.handleAudio);

export default router;
