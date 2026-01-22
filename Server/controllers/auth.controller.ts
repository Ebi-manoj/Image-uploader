import type { Request, Response } from 'express';
import { userZodSchema } from '../utils/validations/userValidator.js';
import { authService } from '../config/container.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { SuccessMessage } from '../constants/messages.js';

export class AuthController {
  async registerUser(req: Request, res: Response) {
    const parsed = userZodSchema.parse(req.body);
    await authService.registerUser(parsed);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.USER_CREATED,
    });
  }
}

export const authController = new AuthController();
