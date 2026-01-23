import { AuthService } from '../services/auth.service.js';
import { BcryptPasswordHasher } from '../utils/BcryptPasswordHasher.js';
import { NodeMailer } from '../utils/NodeMailer.js';
import { OtpService } from '../utils/OtpService.js';

const passwordHasher = new BcryptPasswordHasher();
const emailTransporter = new NodeMailer();
const otpService = new OtpService(emailTransporter);

export const authService = new AuthService(passwordHasher, otpService);
