import type { IPasswordHasher } from '../interfaces/IPasswordHasher.js';
import bcrypt from 'bcrypt';

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly _saltRound = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this._saltRound);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
