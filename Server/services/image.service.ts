import type { ImageResDTO, SaveImagesReqDTO } from "../dtos/upload.dto.js";
import { ImageModel } from "../models/Image.model.js";


export class ImageService {
  async uploadImage(data: SaveImagesReqDTO):Promise<ImageResDTO[]> {
    const {images,userId} = data
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
    return savedImages.map((img) => ({
      id: img._id.toString(),
      title: img.title,
      url: img.url,
      publicId: img.publicId,
      order: img.order,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }));
    
   } 
    
}