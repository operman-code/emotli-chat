import express from 'express';
import { register, verifyOtpCode, login, checkUsername } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOtpCode);
router.post('/login', login);
router.get('/check-username/:username', checkUsername);

export default router; router;
