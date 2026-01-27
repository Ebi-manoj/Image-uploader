import type { ImageResDTO } from './image.dto.js';

export interface GetSignatureDTO {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export interface GetImageResDTO {
  totalPages: number;
  totalCount: number;
  images: ImageResDTO[];
}

export interface UpdateImageOrderDTO {
  id: string;
  order: number;
}
