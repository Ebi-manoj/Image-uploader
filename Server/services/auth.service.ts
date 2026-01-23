import type { RegisterUserReqDTO, VerifyOTPReqDTO } from '../dtos/auth.dto.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import type { IOtpService } from '../interfaces/IOtpService.js';
import { UserModel } from '../model/User.model.js';
import { OtpPurpose, OTP_EXPIRY_MINUTES } from '../constants/otp.js';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage } from '../constants/messages.js';
import { HttpStatus } from '../constants/HttpStatus.js';

export class AuthService {
  constructor(
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpService: IOtpService,
  ) {}

  async registerUser(data: RegisterUserReqDTO): Promise<void> {
    const existingUser = await UserModel.findOne({
      email: data.email,
      isVerified: true,
    });

    if (existingUser) {
      throw new CustomError(
        HttpStatus.CONFLICT,
        ErrorMessage.USER_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(data.password);
    const otp = await this.otpService.sendOtp(
      data.email,
      OtpPurpose.REGISTRATION,
    );
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + OTP_EXPIRY_MINUTES);

    await UserModel.findOneAndUpdate(
      { email: data.email },
      {
        phone: data.phone,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
      },
      { upsert: true },
    );
  }
  async verifyOTP(data: VerifyOTPReqDTO): Promise<void> {
    const user = await UserModel.findOne({ email: data.email });

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    if (!user.otp || !user.otpExpiry) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.OTP_NOT_FOUND);
    }

    if (user.otp !== data.otp) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.INVALID_OTP);
    }

    if (new Date() > user.otpExpiry) {
      throw new CustomError(HttpStatus.BAD_REQUEST, ErrorMessage.OTP_EXPIRED);
    }

    await UserModel.findOneAndUpdate(
      { email: data.email },
      {
        isVerified: true,
        otp: undefined,
        otpExpiry: undefined,
      },
    );
  }
}
