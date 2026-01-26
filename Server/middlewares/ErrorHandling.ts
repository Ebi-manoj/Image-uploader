import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '../constants/HttpStatus.js';
import { CustomError } from '../utils/CustomError.js';

export function errorHandling(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let message = 'Something went Wrong';
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

  if (err instanceof CustomError) {
    message = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof ZodError) {
    message = err.issues[0]?.message || message;
    statusCode = HttpStatus.BAD_REQUEST;
  }
  console.log(err);
  res.status(statusCode).json({ success: false, message });
}
