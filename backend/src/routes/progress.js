import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { getProgress, updateProgress } from '../controllers/progressController.js';

const router = express.Router();

router.get('/', authenticateToken, getProgress);
router.put('/', authenticateToken, updateProgress);

export default router;
