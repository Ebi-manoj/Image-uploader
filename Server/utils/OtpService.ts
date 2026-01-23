import type { IOtpService } from '../interfaces/IOtpService.js';
import type { IEmailTransporter } from '../interfaces/IEmailTransporter.js';
import {
  OtpPurpose,
  OTP_LENGTH,
  OTP_EMAIL_TEMPLATES,
} from '../constants/otp.js';

export class OtpService implements IOtpService {
  constructor(private readonly emailTransporter: IEmailTransporter) {}

  generateOtp(): string {
    const min = Math.pow(10, OTP_LENGTH - 1);
    const max = Math.pow(10, OTP_LENGTH) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
  }

  async sendOtp(email: string, purpose: OtpPurpose): Promise<string> {
    const otp = this.generateOtp();
    const template = OTP_EMAIL_TEMPLATES[purpose];

    if (!template) {
      throw new Error(`No email template found for purpose: ${purpose}`);
    }

    const subject = template.subject;
    const body = template.getBody(otp);

    await this.emailTransporter.sendMail(email, subject, body);
    
    return otp;
  }
}
