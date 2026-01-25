export interface RegisterUserReqDTO {
  email: string;
  phone: string;
  password: string;
}
export interface RegisterUserResDTO {
  email: string;
  otpExpiry: Date;
}

export interface LoginUserReqDTO {
  email: string;
  password: string;
}

export interface VerifyOTPReqDTO {
  email: string;
  otp: string;
}

export interface VerifyOTPResDTO {
  verificationToken?: string;
}

export interface LoginResDTO {
  email: string;
  phone: string;
  accessToken: string;
  refreshToken: string;
}

export interface OTPDetails {
  email: string;
  otpExpiry: Date;
  purpose: 'REGISTRATION' | 'FORGOT_PASSWORD';
}
