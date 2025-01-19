import { Dialect } from 'sequelize/types';
import { loadDotEnv } from './dotenv';
const { env, isProduction, isTest } = loadDotEnv();
export { isProduction, isTest };

export interface ServerConfig {
  port: string;
  dbName: string;
  dbUser: string;
  dbHost: string;
  dbDriver: string;
  dbPassword: string;
  dbPort: number;
  axiosRequestTimeout: number;
  jwtSecretKey: string;
  emailHost: string;
  emailUser: string;
  emailPass: string;
  //latest
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
  port: (env.PORT as string) || '3000',
  dbName: (env.DB_NAME as string) || 'testing',
  dbUser: (env.DB_USER as string) || 'root',
  dbHost: (env.DB_HOST as string) || 'localhost',
  dbDriver: (env.DB_DRIVER as Dialect) || 'mysql',
  dbPassword: (env.DB_PASSWORD as string) || '',
  dbPort: env.DB_PORT ? parseInt(env.DB_PORT) : 3306,
  axiosRequestTimeout: env.AXIOS_REQUEST_TIMEOUT ? parseInt(env.AXIOS_REQUEST_TIMEOUT) : 30000,
  jwtSecretKey: (env.JWT_SECRET_KEY as string) || 'some_secret_key',
  emailHost: (env.EMAIL_HOST as string) || 'smtp.ethereal.email',
  emailUser: env.EMAIL_USER as string,
  emailPass: env.EMAIL_PASS as string,
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
