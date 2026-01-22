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
};
