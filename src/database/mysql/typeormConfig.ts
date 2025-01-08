import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { MessageModel } from './models/messageModel';
import { ConversationModel } from './models/conversationModel';
import { UserModel } from './models/userModel';
import { ConversationMemberModel } from './models/conversationMemberModel';
import { RoleModel } from './models/roleModel';

export const ENTITIES = [UserModel, ConversationModel, MessageModel, ConversationMemberModel, RoleModel];

const env = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.MYSQL_DB_HOST,
  port: Number(env.MYSQL_DB_PORT),
  username: env.MYSQL_DB_USER,
  password: env.MYSQL_DB_PASSWORD,
  database: env.MYSQL_DB_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'debug', // `DEBUG=typeorm:* yarn <COMMAND>`
  entities: ENTITIES,
  migrations: ['src/database/mysql/migrations/*.ts'], //Require full path for migration run from src
  extra: {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
});
