import { v4 as uuidv4 } from 'uuid';

export const API_ROUTE = {
  AUTH: '/api/v2/auth',
  CONVERSATION: '/api/v2/conversation',
  ROLE: '/api/v2/role',
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
  ONE_TO_ONE_CHAT: 'One On One Chat',
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
  USER_ALREADY_EXISTS_WITH_THIS_EMAIL: 'User already exists with this email ID.',
  USER_NOT_REGISTER: 'You are not registered. Please register first.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  ACTIVE_USERS_NOT_FOUND: 'Active users not founds.',
  ADMIN_CAN_ADD_USER: 'Admins are the only ones allowed to add users.',
  GROUP_NOT_EXISTS: 'Group does not exist.',
  USER_ALREADY_EXIST_IN_CONVERSATION: 'User already exists in conversation.',
  USER_NOT_EXISTS: 'User not exists.',
  USERS_NOT_EXISTS: 'Users not exists',
  ONE_USER_COMPULSORY_FOR_CONVERSATION: 'At least one user is required for the conversation.',
};

export const SUCCESS_MESSAGE = {
  USER_REGISTER_SUCCESSFULLY: 'User register successfully.',
  LOGIN_SUCCESSFULLY: 'You have logged in successfully.',
  USERS_FETCHED_SUCCESSFULLY: 'All active users fetched.',
  ROLE_ADDED_SUCCESSFULLY: 'Role add successfully.',
  CONVERSATION_CREATED_SUCCESSFULLY: 'Conversation created successfully.',
};
