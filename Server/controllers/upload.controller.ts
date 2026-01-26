import type { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.js';
import { HttpStatus } from '../constants/HttpStatus.js';

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
}

export const uploadController = new UploadController();
