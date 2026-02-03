import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { generateAIResponse } from '../controllers/conversationController.js';

const router = express.Router();

router.post('/ai', generateAIResponse);

export default router;
