import type { Response, Request } from 'express';
import { CustomError } from '../utils/CustomError.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { ErrorMessage } from '../constants/messages.js';
import { userService } from '../config/container.js';

export class UserController {
  async getSignature(req: Request, res: Response) {
    const dto = await userService.getSignature();

    res.status(HttpStatus.OK).json({
      success: true,
      data: dto,
    });
  }

  async getImages(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    const page = Number(req.query.page) || 1;
    const dto = await userService.getImages(userId, page);

    res.status(HttpStatus.OK).json({
      success: true,
      data: dto,
    });
  }
}

export const userController = new UserController();
