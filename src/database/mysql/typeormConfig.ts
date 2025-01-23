import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { MessageModel } from './models/messageModel';
import { ConversationModel } from './models/conversationModel';
import { UserModel } from './models/userModel';
import { ConversationMemberModel } from './models/conversationMemberModel';
import { RoleModel } from './models/roleModel';
import { SocketModel } from './models/socketModel';
import { MessageStatusModel } from './models/messageStatusModel';

export const ENTITIES = [
  UserModel,
  ConversationModel,
  MessageModel,
  ConversationMemberModel,
  RoleModel,
  SocketModel,
  MessageStatusModel,
];

const env = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.MYSQL_DB_HOST,
  port: Number(env.MYSQL_DB_PORT),
  username: env.MYSQL_DB_USER,
  password: env.MYSQL_DB_PASSWORD,
  database: env.MYSQL_DB_NAME,
  synchronize: false, //set this to false on production from accidentally modifying the database schema.
  dropSchema: false, // In production, this is key set to false because  for accidental loss of data.
  logging: false, //enable this (true) to see the queries being executed for debugging.
  logger: 'debug', // `DEBUG=typeorm:* yarn <COMMAND>`
  entities: ENTITIES,
  migrations: ['src/database/mysql/migrations/*.ts'], //this path for migration run from src
  extra: {
    waitForConnections: true, // when its true ensure that the connection pool will wait for available connections rather than rejecting requests if the pool is full.
    connectionLimit: 10, //simultaneous connections that can be made to the database.
    queueLimit: 0, //This is the maximum number of connection requests that can be queued up if the pool has reached its connection limit.
  },
});
