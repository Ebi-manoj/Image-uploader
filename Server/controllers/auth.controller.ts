import type { Request, Response } from 'express';
import { registerSchema } from '../utils/validations/registerValidator.js';
import { authService } from '../config/container.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { SuccessMessage } from '../constants/messages.js';

export class AuthController {
  async registerUser(req: Request, res: Response) {
    const parsed = registerSchema.parse(req.body);
    await authService.registerUser(parsed);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.USER_CREATED,
    });
  }
}

export const authController = new AuthController();
