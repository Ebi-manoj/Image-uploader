import type { ApiResponse } from '../types/ApiResponse';
import type {
  LoginResDTO,
  LoginUserReqDTO,
  RegisterUserReqDTO,
} from '../types/auth';
import { axiosInstance } from '../utils/axios';

export const loginApi = async (data: LoginUserReqDTO) => {
  const res = await axiosInstance.post<ApiResponse<LoginResDTO>>(
    '/auth/login',
    data,
  );
  return res.data.data;
};
export const signupApi = async (data: RegisterUserReqDTO) => {
  const res = await axiosInstance.post<ApiResponse<LoginResDTO>>(
    '/auth/register',
    data,
  );
  return res.data.data;
};
