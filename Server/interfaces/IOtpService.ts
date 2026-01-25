import type { OtpPurpose } from '../constants/otp.js';

export interface IOtpService {
  generateOtp(): string;
  sendOtp(email: string, purpose: OtpPurpose): Promise<string>;
}
