export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  id: string;
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): TokenDTO;

  verify(token: string): TokenPayload;
}
