import { AuthService } from '../services/auth.service.js';
import { BcryptPasswordHasher } from '../utils/BcryptPasswordHasher.js';

const passwordHasher = new BcryptPasswordHasher();
export const authService = new AuthService(passwordHasher);
