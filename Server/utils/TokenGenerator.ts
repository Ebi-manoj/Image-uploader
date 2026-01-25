import type {
  ITokenGenerator,
  TokenDTO,
  TokenPayload,
  VerificationTokenPayload,
} from '../interfaces/ITokenGenerator.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Env } from './Env.js';

export class JWTTokenGenerator implements ITokenGenerator {
  generate(payload: TokenPayload): TokenDTO {
    const accessToken = jwt.sign(payload, Env.JWT_SECRET_KEY, {
      expiresIn: Env.ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
    const refreshToken = jwt.sign(payload, Env.JWT_SECRET_KEY, {
      expiresIn: Env.REFRESH_TOKEN_EXPIRY,
    } as SignOptions);

    return { accessToken, refreshToken };
  }
  verify(token: string): TokenPayload {
    return jwt.verify(token, Env.JWT_SECRET_KEY) as TokenPayload;
  }

  verificationToken(payload: VerificationTokenPayload): string {
    return jwt.sign(payload, Env.JWT_SECRET_KEY, {
      expiresIn: Env.ACCESS_TOKEN_EXPIRY, 
    } as SignOptions);
  }

  verifyVerificationToken(token: string): VerificationTokenPayload | null {
    try {
      return jwt.verify(token, Env.JWT_SECRET_KEY) as VerificationTokenPayload;
    } catch {
      return null;
    }
  }
}
