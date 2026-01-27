import { HttpStatus } from '../constants/HttpStatus.js';
import { ErrorMessage } from '../constants/messages.js';
import type {
  EditImageReqDTO,
  ImageResDTO,
  SaveImagesReqDTO,
} from '../dtos/image.dto.js';
import type { UpdateImageOrderDTO } from '../dtos/user.dto.js';
import { ImageModel, type ImageDocument } from '../models/Image.model.js';
import { CustomError } from '../utils/CustomError.js';

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

  async editImage(data: EditImageReqDTO, userId: string): Promise<ImageResDTO> {
    const image = await ImageModel.findOne({ _id: data.id, userId });
    if (!image)
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.IMAGE_NOT_FOUND);
    image.title = data.title ?? image.title;
    image.url = data.url ?? image.url;
    image.publicId = data.public_id ?? image.publicId;

    await image.save();
    return this.imageDTOMapper(image);
  }

  async deleteImage(imageId: string, userId: string): Promise<void> {
    const deletedImage = await ImageModel.findOneAndDelete({
      userId,
      _id: imageId,
    }).lean();
    if (!deletedImage) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.IMAGE_NOT_FOUND);
    }

    await ImageModel.updateMany(
      { userId, order: { $gt: deletedImage.order } },
      {
        $inc: { order: -1 },
      },
    );
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
