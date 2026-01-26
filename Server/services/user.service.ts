import { PAGE_LIMIT } from '../constants/constant.js';
import type { ImageResDTO } from '../dtos/upload.dto.js';
import type { GetImageResDTO } from '../dtos/user.dto.js';
import { ImageModel, type ImageDocument } from '../models/Image.model.js';

export class UserService {
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
