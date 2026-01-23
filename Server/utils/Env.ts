import { ErrorMessage } from '../constants/messages.js';
import dotenv from 'dotenv';

dotenv.config();

function getEnvVariabes(key: string, defaultVal?: string): string {
  const value = process.env[key] || defaultVal;
  if (!value) throw new Error(`${ErrorMessage.ENV_VAR_MISSNG}-${key}`);
  return value;
}

export const Env = {
  MONGO_URI: getEnvVariabes('MONGO_URI'),
  REFRESH_TOKEN_EXPIRY: getEnvVariabes('REFRESH_TOKEN_EXPIRY'),
  ACCESS_TOKEN_EXPIRY: getEnvVariabes('ACCESS_TOKEN_EXPIRY'),
  JWT_SECRET_KEY: getEnvVariabes('JWT_SECRET_KEY'),
  EMAIL_USER: getEnvVariabes('EMAIL_USER'),
  GOOGLE_APP_PASS: getEnvVariabes('GOOGLE_APP_PASS'),
};
