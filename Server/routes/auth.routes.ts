import express from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/login', authController.loginUser);
router.post('/auth/register', authController.registerUser);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);

export default router;
