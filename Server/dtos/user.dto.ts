import type { ImageResDTO } from './upload.dto.js';

export interface GetImageResDTO {
  totalPages: number;
  totalCount: number;
  images: ImageResDTO[];
}

export interface UpdateImageOrderDTO {
  id: string;
  order: number;
}
