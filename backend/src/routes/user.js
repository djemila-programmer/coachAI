import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { getMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);

export default router;
