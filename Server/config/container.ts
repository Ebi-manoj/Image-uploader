import { AuthService } from '../services/auth.service.js';
import { BcryptPasswordHasher } from '../utils/BcryptPasswordHasher.js';
import { NodeMailer } from '../utils/NodeMailer.js';
import { OtpService } from '../utils/OtpService.js';
import { JWTTokenGenerator } from '../utils/TokenGenerator.js';

const passwordHasher = new BcryptPasswordHasher();
const emailTransporter = new NodeMailer();
const tokenGenerator = new JWTTokenGenerator();
const otpService = new OtpService(emailTransporter);

export const authService = new AuthService(
  passwordHasher,
  otpService,
  tokenGenerator,
);

export { tokenGenerator };
