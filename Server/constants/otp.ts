export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export const OTP_EXPIRY_MINUTES = 3;
export const OTP_LENGTH = 6;

export const OTP_EMAIL_TEMPLATES = {
  [OtpPurpose.REGISTRATION]: {
    subject: 'Verify Your Email - Registration OTP',
    getBody: (otp: string) =>
      `Welcome! Your OTP for email verification is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you didn't request this, please ignore this email.`,
  },
  [OtpPurpose.FORGOT_PASSWORD]: {
    subject: 'Password Reset OTP',
    getBody: (otp: string) =>
      `Your OTP for password reset is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you didn't request this, please ignore this email.`,
  },
};
