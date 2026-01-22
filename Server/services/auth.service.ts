import type { RegisterUserReqDTO } from '../dtos/auth.dto.js';
import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import { UserModel } from '../model/User.model.js';

export class AuthService {
  constructor(private readonly passwordHasher: IPasswordHasher) {}
  async registerUser(data: RegisterUserReqDTO): Promise<void> {
    const hashedPassword = await this.passwordHasher.hash(data.password);
    await UserModel.create({
      ...data,
      password: hashedPassword,
    });
  }
}
