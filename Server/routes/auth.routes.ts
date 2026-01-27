import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { verifyResetToken } from '../middlewares/verifyResetToken.js';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', verifyResetToken, authController.resetPassword);
router.get('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
