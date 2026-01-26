export interface UploadImageDTO {
  title: string;
  url: string;
  publicId: string;
}

export interface SaveImagesReqDTO {
  images: UploadImageDTO[];
  userId:string
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
