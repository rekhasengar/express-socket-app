import { v4 as uuidv4 } from 'uuid';

export const API_ROUTE = {
  AUTH: '/api/v2/auth',
  CONVERSATIONS: '/api/v2/conversations',
  ROLES: '/api/v2/roles',
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

export const LOGS_ACTIONS = {
  AUTH: 'auth',
  CONVERSATION: 'conversation',
};

export const CONTROLLER_LOGS_MESSAGE = {
  REGISTER_PROCESS_COMPLETED: 'Register process complete.',
  LOGIN_PROCESS_COMPLETED: 'Login process completed.',
  LOGOUT_PROCESS_COMPLETED: 'Logout process completed.',
};
