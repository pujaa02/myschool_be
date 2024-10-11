import dotenv from 'dotenv';
import { config } from 'dotenv';
dotenv.config();
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  ENABLE_LOG,
  SECRET_KEY,
  FRONT_URL,
  SERVER_URL,
  LOG_FORMAT,
  LOG_DIR,
  JWT_SECRET,
  ARGON_SALT_LENGTH,
} = process.env;
