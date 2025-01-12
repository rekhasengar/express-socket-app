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
  USER_ROLE_NOT_FOUND: 'User Role not exists.',
  ADMIN_CAN_CHANGE_GROUP_NAME: 'Only admin can change group name.',
  CONVERSATION_NOT_EXISTS: 'This conversation not exists.',
};

export const SUCCESS_MESSAGE = {
  USER_REGISTER_SUCCESSFULLY: 'User register successfully.',
  LOGIN_SUCCESSFULLY: 'You have logged in successfully.',
  USERS_FETCHED_SUCCESSFULLY: 'All active users fetched.',
  ROLE_ADDED_SUCCESSFULLY: 'Role add successfully.',
  CONVERSATION_CREATED_SUCCESSFULLY: 'Conversation created successfully.',
  CONVERSATION_DELETED_SUCCESSFULLY: 'Conversation deleted successfully.',
  LOGOUT_SUCCESSFULLY: 'Logout successfully.',
  SOCKET_ID_ADDED_SUCCESSFULLY: 'Socket id added successfully.',
};

export const EVENT_MESSAGE = {
  NEW_USER_ADDED_IN_GROUP: (username: string): string => {
    return `${username} added in this group`;
  },
};
