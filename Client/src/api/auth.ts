import type { ApiResponse } from '../types/ApiResponse';
import type {
  LoginResDTO,
  LoginUserReqDTO,
  RegisterUserReqDTO,
  RegisterUserResDTO,
  VerifyOTPReqDTO,
  VerifyOTPResDTO,
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
  const res = await axiosInstance.post<ApiResponse<VerifyOTPResDTO>>(
    '/auth/verify-otp',
    data,
  );
  return res.data.data;
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

export const resetPasswordApi = async (
  verificationToken: string,
  newPassword: string,
) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    '/auth/reset-password',
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${verificationToken}`,
      },
    },
  );
  return res.data;
};

export const refreshTokenApi = async () => {
  const res = await axiosInstance.get<ApiResponse<LoginResDTO>>(
    '/auth/refresh-token',
  );
  return res.data.data;
};

export const logoutApi = async () => {
  const res = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
  return res.data;
};
