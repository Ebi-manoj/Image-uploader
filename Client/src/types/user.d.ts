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