import { loadDotEnv } from './dotenv';
const { env, isProduction, isTest } = loadDotEnv();
export { isProduction, isTest };

export interface ServerConfig {
  PORT: string;
  AXIOS_REQUEST_TIME_OUT: number;
  JWT_SECRET_KEY: string;
  EMAIL_HOST: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  MYSQL_DB_PORT: number;
  MYSQL_DB_HOST: string;
  MYSQL_DB_NAME: string;
  MYSQL_DB_USER: string;
  MYSQL_DB_PASSWORD: string;
  APP_URL: string;
}

/**
 * Derive all the environment variables from this property instead of using them directly.
 */
export const serverConfig: ServerConfig = {
  PORT: (env.PORT as string) || '3000',
  AXIOS_REQUEST_TIME_OUT: env.AXIOS_REQUEST_TIMEOUT ? parseInt(env.AXIOS_REQUEST_TIMEOUT) : 30000,
  JWT_SECRET_KEY: (env.JWT_SECRET_KEY as string) || 'some_secret_key',
  EMAIL_HOST: (env.EMAIL_HOST as string) || 'smtp.ethereal.email',
  EMAIL_USER: env.EMAIL_USER as string,
  EMAIL_PASSWORD: env.EMAIL_PASS as string,
  //latest
  MYSQL_DB_HOST: env.MYSQL_DB_HOST || 'localhost',
  MYSQL_DB_PORT: Number(env.MYSQL_DB_PORT || 0),
  MYSQL_DB_USER: env.MYSQL_DB_USER || 'root',
  MYSQL_DB_PASSWORD: env.MYSQL_DB_PASSWORD || '',
  MYSQL_DB_NAME: env.MYSQL_DB_NAME || 'local',
  APP_URL: env.APP_URL || `http://localhost:${env.PORT}`,
};

export const SUPPORTED_LOCALE = ['en', 'hi'];
export const DEFAULT_LOCALE = 'en';
