import type { Response, Request } from 'express';
import { CustomError } from '../utils/CustomError.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { userService } from '../config/container.js';
import { changePasswordSchema } from '../utils/validations/changePasswordValidator.js';

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

  async changePassword(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);

    const validatedData = changePasswordSchema.parse(req.body);
    await userService.changePassword(validatedData, userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.PASSWORD_CHANGED_SUCCESS,
    });
  }
}

export const userController = new UserController();
