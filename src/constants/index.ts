import { v4 as uuidv4 } from 'uuid';

export default {
  PORT: 3000,
  GENERATE_UUID_V4: (): string => uuidv4(),
  SERVER_WELCOME_MESSAGE: 'Hello ChatApp',
  ROUTE_NOT_FOUND: 'Route not found',
  MY_SQL_CONNECTED_SUCCESSFULLY: 'MySql Database connection created successfully.',
  MY_SQL_UNABLE_TO_CONNECT: 'Unable to  connection with mysql database',
};

export const API_ROUTES = {
  AUTH: 'auth',
  CONVERSATIONS: 'conversations',
  ROLES: 'roles',
  USERS: 'users',
};

export const USER_CHAT_TYPE = {
  ONE_TO_ONE_CHAT: 'One On One Chat',
};

export const JOI_VALIDATION_MESSAGE = {
  GROUP_NAME: 'Group name is required.',
  USERS: 'Must have at least 2 users.',
  FIST_NAME: 'First name required.',
  LAST_NAME: 'Last name required.',
  EMAIL: ' Email not valid.',
  PASSWORD: 'Password required.',
  USER_ID: 'User id required.',
  ADMIN_ID: 'Admin id required.',
  CONVERSATION_ID: 'Conversation id required.',
  MESSAGE_ID: 'Message id required.',
  ROLE_DESCRIPTION: 'Role description required.',
  ROLE: 'Role required.',
  TOKEN: 'Token required.',
  NEW_PASSWORD: 'New password required.',
  OLD_PASSWORD: 'Old password required.',
};

export const LOGS = {
  ERROR_MESSAGE: (className: string, methodName: string): string => {
    return `Error in ${className} #${methodName}`;
  },
  GET_SOURCE: (className: string, methodName: string): string => {
    return `Successfully request receive by ${className} #${methodName}`;
  },
};
