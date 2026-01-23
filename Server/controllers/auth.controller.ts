import type { Request, Response } from 'express';
import { registerSchema } from '../utils/validations/registerValidator.js';
import { verifyOtpSchema } from '../utils/validations/verifyOtpValidator.js';
import { authService } from '../config/container.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { SuccessMessage } from '../constants/messages.js';
import { OtpPurpose } from '../constants/otp.js';

export class AuthController {
  async registerUser(req: Request, res: Response) {
    const parsed = registerSchema.parse(req.body);
    await authService.registerUser(parsed);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.OTP_SENT,
    });
  }

  async verifyOtp(req: Request, res: Response) {
    const parsed = verifyOtpSchema.parse(req.body);
    await authService.verifyOTP(parsed);
    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.OTP_VERIFIED,
    });
  }
}

export const authController = new AuthController();
