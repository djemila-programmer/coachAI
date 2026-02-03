import express from 'express';
import { login, loginWithGoogle } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/google-login', loginWithGoogle);

export default router;
