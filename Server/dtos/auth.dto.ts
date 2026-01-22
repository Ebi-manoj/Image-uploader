export interface RegisterUserReqDTO {
  email: string;
  phone: string;
  password: string;
}

export interface LoginUserReqDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  email: string;
  phone: string;
}
