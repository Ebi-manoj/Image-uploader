export interface UploadImageDTO {
  title: string;
  url: string;
  publicId: string;
}

export interface SaveImagesReqDTO {
  images: UploadImageDTO[];
  userId: string;
}

export interface EditImageReqDTO {
   id: string;
    title: string;
    url?: string | undefined;
    public_id?: string | undefined;
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
