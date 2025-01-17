import { v4 as uuidv4 } from 'uuid';

export const API_ROUTE = {
  AUTH: '/api/v2/auth',
  CONVERSATIONS: '/api/v2/conversations',
  ROLES: '/api/v2/roles',
  USERS: '/api/v2/users',
  MESSAGES: '/api/v2/message',
};

export default {
  GENERATE_UUID_V4: (): string => uuidv4(),
  MY_SQL_CONNECTED_SUCCESSFULLY: 'MySql Database connection created successfully.',
  MY_SQL_UNABLE_TO_CONNECT: 'Unable to  connection with mysql database',
};

export const USER_CHAT_TYPE = {
  ONE_TO_ONE_CHAT: 'One On One Chat',
};

export const MESSAGE_VALIDATION = {
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
};

export const LOGS = {
  ERROR_MESSAGE: (className: string, methodName: string): string => {
    return `Error in ${className} #${methodName}`;
  },
  SUCCESS_MESSAGE: (className: string, methodName: string): string => {
    return `Successfully request receive by ${className} #${methodName}`;
  },
};

export const ACTION_MESSAGE = {
  REGISTER_PROCESS: 'Register process',
  LOGIN_PROCESS: 'Login process',
  LOGOUT_PROCESS: 'Logout process',
  USER_STATUS_PROCESS: 'User status process',
  USER_ROLE_PROCESS: 'User role process',
  CONVERSATION_MESSAGE_PROCESS: 'Conversation message process.',
  GET_ALL_ACTIVE_USER_PROCESS: 'Fetching all active users from the database',
};
