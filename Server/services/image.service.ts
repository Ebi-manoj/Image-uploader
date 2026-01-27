import type { ImageResDTO, SaveImagesReqDTO } from '../dtos/image.dto.js';
import type { UpdateImageOrderDTO } from '../dtos/user.dto.js';
import { ImageModel } from '../models/Image.model.js';

export class ImageService {
  async uploadImage(data: SaveImagesReqDTO): Promise<ImageResDTO[]> {
    const { images, userId } = data;
    const maxOrderImage = await ImageModel.findOne({ userId })
      .sort({ order: -1 })
      .select('order');

    const startOrder = maxOrderImage ? maxOrderImage.order + 1 : 0;

    const imageDocuments = images.map((img, index) => ({
      userId,
      title: img.title,
      url: img.url,
      publicId: img.publicId,
      order: startOrder + index,
    }));

    const savedImages = await ImageModel.insertMany(imageDocuments);
    return savedImages.map(img => ({
      id: img._id.toString(),
      title: img.title,
      url: img.url,
      publicId: img.publicId,
      order: img.order,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }));
  }
  async updateImageOrder(
    data: UpdateImageOrderDTO[],
    userId: string,
  ): Promise<UpdateImageOrderDTO[]> {
    const updatedImages = await Promise.all(
      data.map(async img => {
        return await ImageModel.findOneAndUpdate(
          { userId, _id: img.id },
          {
            order: img.order,
          },
        );
      }),
    );
    return updatedImages
      .filter(img => img !== null)
      .map(img => ({ id: img.id, order: img.order }));
  }
}
