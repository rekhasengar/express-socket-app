import { v4 as uuidv4 } from 'uuid';

export const API_ROUTE = {
  AUTH: '/api/v2/auth',
  CONVERSATION: '/api/v2/conversation',
};

export default {
  GENERATE_UUID_V4: (): string => uuidv4(),
  MY_SQL_CONNECTED_SUCCESSFULLY: 'MySql Database connection created successfully.',
  MY_SQL_UNABLE_TO_CONNECT: 'Unable to  connection with mysql database',
};

export const CONTROLLER_MESSAGE = {
  SUCCESS: 'Success',
};

export const USER_CHAT_TYPE = {
  ONE_TO_ONE_CHAT: 'One on one chat',
};

export const MESSAGE_VALIDATION = {
  GROUP_NAME: 'Group name is required.',
  USERS: 'Must have at least 2 users.',
  FIST_NAME: 'First name required.',
  LAST_NAME: 'Last name required.',
  EMAIL: ' Email not valid.',
  PASSWORD: 'Password required.',
};

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: (value: string): string => {
    return `Users not found with ${value} !.`;
  },
  USER_ALREADY_EXISTS: 'User already exists with this email ID.',
  USER_NOT_REGISTER: 'You are not registered. Please register first.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  ACTIVE_USERS_NOT_FOUND: 'Active users not founds.',
};

export const SUCCESS_MESSAGE = {
  USER_REGISTER_SUCCESSFULLY: 'User register successfully.',
  LOGIN_SUCCESSFULLY: 'You have logged in successfully.',
  USERS_FETCHED_SUCCESSFULLY: 'All active users fetched.',
};
