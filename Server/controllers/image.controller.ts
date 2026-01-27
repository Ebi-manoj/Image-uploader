import type { Request, Response } from 'express';

import { HttpStatus } from '../constants/HttpStatus.js';
import type {
  EditImageReqDTO,
  ImageResDTO,
  SaveImagesReqDTO,
} from '../dtos/image.dto.js';
import { imageService } from '../config/container.js';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage, SuccessMessage } from '../constants/messages.js';
import { editImageSchema } from '../utils/validations/editImageValidator.js';
import { Types } from 'mongoose';

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

  async editImage(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    const imageId = req.params.id;
    const validatedData = editImageSchema.parse({ ...req.body, id: imageId });
    const updatedImage = await imageService.editImage(validatedData, userId);

    res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.IMAGE_UPDATED_SUCESS,
      data: updatedImage,
    });
  }
  async deleteImage(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    const { id } = req.params as { id: string };
    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.INVALID_ID);
    }

    await imageService.deleteImage(id, userId);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessage.IMAGE_DELETED_SUCESS,
    });
  }
}

export const imageController = new ImageController();
