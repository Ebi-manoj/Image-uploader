import type {
  LoginResDTO,
  LoginUserReqDTO,
  RegisterUserReqDTO,
  RegisterUserResDTO,
  ResetPasswordReqDTO,
  VerifyOTPReqDTO,
} from '../dtos/auth.dto.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import type { IOtpService } from '../interfaces/IOtpService.js';
import { UserModel } from '../model/User.model.js';
import { OtpPurpose, OTP_EXPIRY_MINUTES } from '../constants/otp.js';
import { CustomError } from '../utils/CustomError.js';
import { ErrorMessage } from '../constants/messages.js';
import { HttpStatus } from '../constants/HttpStatus.js';
import type { ITokenGenerator } from '../interfaces/ITokenGenerator.js';

export class AuthService {
  constructor(
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpService: IOtpService,
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async loginUser(data: LoginUserReqDTO): Promise<LoginResDTO> {
    const user = await UserModel.findOne({
      email: data.email,
      isVerified: true,
    });
    if (!user)
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.INVALID_CRENDTIALS,
      );

    const isPasswordMatch = await this.passwordHasher.compare(
      data.password,
      user.password,
    );
    if (!isPasswordMatch)
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.INVALID_CRENDTIALS,
      );
    const { accessToken, refreshToken } = this.tokenGenerator.generate({
      id: user.id,
    });

    return {
      email: user.email,
      phone: user.phone,
      accessToken,
      refreshToken,
    };
  }

  async registerUser(data: RegisterUserReqDTO): Promise<RegisterUserResDTO> {
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
    return {
      email: data.email,
      otpExpiry,
    };
  }
  async verifyOTP(
    data: VerifyOTPReqDTO,
  ): Promise<{ verificationToken?: string }> {
    const user = await UserModel.findOne({ email: data.email });

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    if (!user?.otp || !user?.otpExpiry) {
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
        $unset: {
          otp: '',
          otpExpiry: '',
        },
      },
    );
    const verificationToken = this.tokenGenerator.verificationToken({
      email: data.email,
    });
    return { verificationToken };
  }

  async resendOTP(
    email: string,
    purpose: OtpPurpose,
  ): Promise<RegisterUserResDTO> {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    if (purpose === OtpPurpose.REGISTRATION && user.isVerified) {
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.USER_ALREADY_EXISTS,
      );
    }

    if (purpose === OtpPurpose.FORGOT_PASSWORD && !user.isVerified) {
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.USER_NOT_VERIFIED,
      );
    }

    const otp = await this.otpService.sendOtp(email, purpose);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + OTP_EXPIRY_MINUTES);
    await UserModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry,
      },
    );
    return {
      email,
      otpExpiry,
    };
  }

  async forgotPassword(email: string): Promise<RegisterUserResDTO> {
    const user = await UserModel.findOne({ email, isVerified: true });

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    const otp = await this.otpService.sendOtp(
      email,
      OtpPurpose.FORGOT_PASSWORD,
    );
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + OTP_EXPIRY_MINUTES);

    await UserModel.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry,
      },
    );

    return {
      email,
      otpExpiry,
    };
  }

  async resetPassword(data: ResetPasswordReqDTO): Promise<void> {
    const user = await UserModel.findOne({ email: data.email });

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
    }

    const hashedPassword = await this.passwordHasher.hash(data.newPassword);

    await UserModel.findOneAndUpdate(
      { email: data.email },
      {
        password: hashedPassword,
      },
    );
  }
}
