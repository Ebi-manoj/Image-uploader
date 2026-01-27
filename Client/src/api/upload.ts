import { axiosInstance } from '../utils/axios';
import type { ApiResponse } from '../types/ApiResponse';
import type {
  CloudinarySignature,
  GetImagesParams,
  GetImagesResponse,
  ImageResDTO,
  UploadImageData,
} from '../types/user';

export const getCloudinarySignatureApi = async () => {
  const res =
    await axiosInstance.get<ApiResponse<CloudinarySignature>>(
      '/user/signature',
    );
  return res.data.data;
};

export const saveImagesApi = async (images: UploadImageData[]) => {
  const res = await axiosInstance.post<ApiResponse<ImageResDTO[]>>('/image', {
    images,
  });
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
  const res = await axiosInstance.patch<ApiResponse<ImageResDTO[]>>('/image', {
    imageOrders,
  });
  return res.data.data;
};

export const deleteImageApi = async (id: string) => {
  const res = await axiosInstance.delete<ApiResponse<null>>(`/image/${id}`);
  return res.data;
};

export const editImageApi = async (
  id: string,
  data: { title: string; url?: string; public_id?: string },
) => {
  const res = await axiosInstance.put<ApiResponse<ImageResDTO>>(
    `/image/${id}`,
    data,
  );
  return res.data.data;
};
