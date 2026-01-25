import type { Request, Response, NextFunction } from 'express';
import { tokenGenerator } from '../config/container.js';
import { CustomError } from '../utils/CustomError.js';
import { HttpStatus } from '../constants/HttpStatus.js';

export const verifyResetToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        'Verification token is required',
      );
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Token is missing');
    }

    const decoded = tokenGenerator.verifyVerificationToken(token);

    if (!decoded || !decoded.email) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Invalid token');
    }

    req.body.email = decoded.email;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(HttpStatus.BAD_REQUEST, 'Invalid or expired token');
  }
};
