export interface User {
  email: string;
  phone: string;
}

export interface UploadImageData {
  title: string;
  url: string;
  publicId: string;
}

export interface ImageResDTO {
  id: string;
  title: string;
  url: string;
  publicId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export interface GetImagesParams {
  page: number;
  limit?: number;
}

export interface GetImagesResponse {
  images: ImageResDTO[];
  totalPages: boolean;
  totalCount: number;
}
