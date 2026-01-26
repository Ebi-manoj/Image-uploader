import { axiosInstance } from '../utils/axios';
import type { ApiResponse } from '../types/ApiResponse';
import type { ImageResDTO, UploadImageData } from '../types/user';

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
}

export interface GetImagesParams {
  page: number;
  limit: number;
}

export interface GetImagesResponse {
  images: ImageResDTO[];
  hasMore: boolean;
  total: number;
}

export const getCloudinarySignatureApi = async () => {
  const res =
    await axiosInstance.get<ApiResponse<CloudinarySignature>>(
      '/upload/signature',
    );
  return res.data.data;
};

export const saveImagesApi = async (images: UploadImageData[]) => {
  const res = await axiosInstance.post<ApiResponse<ImageResDTO[]>>(
    '/upload/images',
    {
      images,
    },
  );
  return res.data.data;
};

export const getImagesApi = async (params: GetImagesParams) => {
  const res = await axiosInstance.get<ApiResponse<GetImagesResponse>>(
    '/user/image',
    { params },
  );
  return res.data.data;
};

export const updateImageOrderApi = async (
  imageOrders: { id: string; order: number }[],
) => {
  const res = await axiosInstance.patch<ApiResponse<ImageResDTO[]>>(
    '/user/image/order',
    { imageOrders },
  );
  return res.data.data;
};

export const deleteImageApi = async (id: string) => {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/upload/images/${id}`,
  );
  return res.data;
};
