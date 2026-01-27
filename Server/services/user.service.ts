import { cloudinary } from '../config/cloudinary.js';
import { PAGE_LIMIT } from '../constants/constant.js';
import type { ImageResDTO } from '../dtos/image.dto.js';
import type { GetImageResDTO, GetSignatureDTO } from '../dtos/user.dto.js';
import { ImageModel, type ImageDocument } from '../models/Image.model.js';
import { Env } from '../utils/Env.js';

export class UserService {
  async getSignature(): Promise<GetSignatureDTO> {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'image-uploader',
      },
      Env.CLOUDINARY_SECRET,
    );
    return {
      signature,
      timestamp,
      cloudName: Env.CLOUDINARY_NAME,
      apiKey: Env.CLOUDINARY_KEY,
    };
  }

  async getImages(userId: string, page: number): Promise<GetImageResDTO> {
    const skip = (page - 1) * PAGE_LIMIT;

    const images = await ImageModel.find({ userId })
      .skip(skip)
      .limit(PAGE_LIMIT)
      .sort({ order: 1 });

    const totalCount = await ImageModel.countDocuments({ userId });
    const totalPages = Math.ceil(totalCount / PAGE_LIMIT);
    return {
      images: images.map(this.imageDTOMapper),
      totalCount,
      totalPages,
    };
  }

  private imageDTOMapper(images: ImageDocument): ImageResDTO {
    return {
      id: images.id,
      url: images.url,
      publicId: images.publicId,
      createdAt: images.createdAt,
      updatedAt: images.updatedAt,
      order: images.order,
      title: images.title,
    };
  }
}
