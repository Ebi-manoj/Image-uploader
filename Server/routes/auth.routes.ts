import express from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/register', authController.registerUser);
router.post('/auth/verify-otp', authController.verifyOtp);

export default router;
