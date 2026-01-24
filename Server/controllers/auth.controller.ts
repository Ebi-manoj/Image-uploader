import type { Request, Response } from 'express';
import { registerSchema } from '../utils/validations/registerValidator.js';
import { verifyOtpSchema } from '../utils/validations/verifyOtpValidator.js';
import { authService } from '../config/container.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { SuccessMessage } from '../constants/messages.js';
import { loginSchema } from '../utils/validations/loginValidator.js';
import { REFRESH_TOKEN } from '../constants/constant.js';

export class AuthController {
  async loginUser(req: Request, res: Response) {
    const parsed = loginSchema.parse(req.body);

    const result = await authService.loginUser(parsed);
    const { refreshToken, ...dto } = result;
    res.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'lax',
    });
    return res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.LOGIN_SUCCESS,
      data: dto,
    });
  }

  async registerUser(req: Request, res: Response) {
    const parsed = registerSchema.parse(req.body);
    const dto = await authService.registerUser(parsed);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.OTP_SENT,
      data: dto,
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
