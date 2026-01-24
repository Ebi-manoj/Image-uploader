import type { ApiResponse } from '../types/ApiResponse';
import type {
  LoginResDTO,
  LoginUserReqDTO,
  RegisterUserReqDTO,
  RegisterUserResDTO,
  VerifyOTPReqDTO,
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
  const res = await axiosInstance.post<ApiResponse<RegisterUserResDTO>>(
    '/auth/register',
    data,
  );
  return res.data.data;
};

export const verifyOtpApi = async (data: VerifyOTPReqDTO) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    '/auth/verify-otp',
    data,
  );
  return res.data;
};

export const resendOtpApi = async (
  email: string,
  purpose: 'REGISTRATION' | 'FORGOT_PASSWORD',
) => {
  const res = await axiosInstance.post<ApiResponse<RegisterUserResDTO>>(
    '/auth/resend-otp',
    { email, purpose },
  );
  return res.data.data;
};

export const forgotPasswordApi = async (email: string) => {
  const res = await axiosInstance.post<ApiResponse<RegisterUserResDTO>>(
    '/auth/forgot-password',
    { email },
  );
  return res.data.data;
};
