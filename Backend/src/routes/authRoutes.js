import express from 'express';
import { register, verifyOtpCode, login } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyOtpCode);
router.post('/login', login);

export default router;
