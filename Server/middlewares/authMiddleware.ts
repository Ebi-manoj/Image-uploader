import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage } from '../constants/messages.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { tokenGenerator } from '../config/container.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
  }

  try {
    const decodedToken = tokenGenerator.verify(token);
    if (!decodedToken || !decodedToken.id) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    }

    req.user = { id: decodedToken.id };
    next();
  } catch (error) {
    throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.INVALID_TOKEN);
  }
};
