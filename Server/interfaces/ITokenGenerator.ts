export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
}

export interface VerificationTokenPayload {
  email: string;
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): TokenDTO;

  verify(token: string): TokenPayload;

  verificationToken(payload: VerificationTokenPayload): string;

  verifyVerificationToken(token: string): VerificationTokenPayload | null;
}
