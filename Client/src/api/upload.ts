import { axiosInstance } from '../utils/axios';
import type { ApiResponse } from '../types/ApiResponse';
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
