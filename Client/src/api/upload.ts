import { axiosInstance } from '../utils/axios';
import type { ApiResponse } from '../types/ApiResponse';
import type { ImageResDTO, UploadImageData } from '../types/user';
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export const getCloudinarySignatureApi = async () => {
  const res =
    await axiosInstance.get<ApiResponse<CloudinarySignature>>(
      '/upload/signature',
    );
  return res.data.data;
};



export const saveImagesApi = async (images: UploadImageData[]) => {
  const res = await axiosInstance.post<ApiResponse<ImageResDTO[]>>('/upload/images', {
    images,
  });
  return res.data.data;
};
