import type { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import type { SaveImagesReqDTO } from '../dtos/upload.dto.js';
import { imageService } from '../config/container.js';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage, SuccessMessage } from '../constants/messages.js';

export class UploadController {
  async getSignature(req: Request, res: Response) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'image-uploader',
      },
      process.env.CLOUDINARY_SECRET!,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_KEY,
      },
    });
  }

  async saveImages(req: Request, res: Response) {
    const { images }:   SaveImagesReqDTO = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED);
    }

   const savedImages = await imageService.uploadImage({images,userId})

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessage.IMAGE_UPLOAD_SUCCESS,
      data: savedImages,
    });
  }
}

export const uploadController = new UploadController();
