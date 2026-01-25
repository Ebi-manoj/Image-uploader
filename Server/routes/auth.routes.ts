import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { verifyResetToken } from '../middlewares/verifyResetToken.js';

const router = express.Router();

router.post('/auth/login', authController.loginUser);
router.post('/auth/register', authController.registerUser);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post(
  '/auth/reset-password',
  verifyResetToken,
  authController.resetPassword,
);
router.get('/auth/refresh-token', authController.refreshToken);
router.post('/auth/logout', authController.logout);

export default router;
