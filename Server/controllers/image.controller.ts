import type { Request, Response } from 'express';

import { HttpStatus } from '../constants/HttpStatus.js';
import type { SaveImagesReqDTO } from '../dtos/image.dto.js';
import { imageService } from '../config/container.js';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage, SuccessMessage } from '../constants/messages.js';

export class ImageController {
  async saveImages(req: Request, res: Response) {
    const { images }: SaveImagesReqDTO = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    }

    const savedImages = await imageService.uploadImage({ images, userId });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.IMAGE_UPLOAD_SUCCESS,
      data: savedImages,
    });
  }
  async updateImageOrder(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);

    const dto = await imageService.updateImageOrder(
      req.body.imageOrders,
      userId,
    );
    res.status(HttpStatus.OK).json({
      success: true,
      data: dto,
    });
  }
}

export const imageController = new ImageController();
