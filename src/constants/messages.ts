export const USER_MESSAGES = {
  USER_ALREADY_EXISTS_WITH_THIS_EMAIL: 'User already exists with this email ID.',
  USER_NOT_REGISTER: 'You are not registered. Please register first.',
  USER_ALREADY_EXISTS_IN_CONVERSATION: 'User already exists in conversation.',
  USERS_ALREADY_EXISTS_IN_CONVERSATION: 'Users already exists in conversation.',
  USER_NOT_FOUND: 'User not found.',
  USER_ROLE_NOT_FOUND: 'User Role not exists.',
  ACTIVE_USERS_NOT_FOUND: 'Active users not founds.',
  ADMIN_NOT_FOUND: 'Admin not found.',
  AT_LEAST_ONE_USER_REQUIRED_FOR_THE_CONVERSATION: 'At least one user required for the conversation.',
  USER_NOT_FOUND_WITH_EMAIL: 'User not found with this email.',
  ALL_USERS_RETRIEVED_SUCCESSFULLY: 'All users retrieved successfully.',
  YOU_DO_NOT_HAVE_ADMIN_PERMISSION: 'You do not have admin permissions.',
  USER_STATUS_FETCHED_SUCCESSFULLY: 'User status fetched successfully.',
  ERROR_WHILE_FETCHED_USER_STATUS: 'Error while fetched user status.',
  USER_NOT_FOUND_IN_CONVERSATION: 'User not found in conversation.',
  USER_HAS_BEEN_DELETED_SUCCESSFULLY: 'User has been deleted successfully.',
  USER_HAS_BEEN_UPDATED_SUCCESSFULLY: 'User has been updated successfully.',
  USER_HAS_BEEN_RETRIEVED_SUCCESSFULLY: 'User has been retrieved successfully.',
};

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials.',
  REGISTERED_SUCCESSFULLY: 'You have registered successfully.',
  LOGGED_IN_SUCCESSFULLY: 'You have logged in successfully.',
  LOGGED_OUT_SUCCESSFULLY: 'Logged out successfully.',
  RESET_PASSWORD_LINK_MAILED_SUCCESSFULLY: 'Reset password link mailed successfully.',
  PASSWORD_RESET_SUCCESSFULLY: 'Password has been successfully reset',
  PASSWORD_CHANGED_SUCCESSFULLY: 'Password has been successfully changed.',
  //token related messages
  TOKEN_MISSING: 'Token missing.',
  TOKEN_INVALID: 'Invalid token.',
};

export const ROLE_MESSAGES = {
  ROLE_ADDED_SUCCESSFULLY: 'Role added successfully.',
  ADMIN_CAN_PERFORM_THIS_ACTION: 'This action can only be performed by an admin.',
  USER_ROLES_COULD_NOT_BE_FOUND: 'User roles could not be found.',
  USER_ROLES_RETRIEVED_SUCCESSFULLY: 'User roles retrieved successfully.',
};

export const CONVERSATION_MESSAGES = {
  CONVERSATION_CREATED_SUCCESSFULLY: 'Conversation created successfully.',
  CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY: 'Conversation message deleted successfully.',
  ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY: 'One to one conversation created successfully.',
  GROUP_CONVERSATION_CREATED_SUCCESSFULLY: 'Group conversation created successfully.',
  USER_NOT_FOUND_IN_THIS_CONVERSATION: 'You are not in this conversation.',
  CONVERSATION_NOT_FOUND: 'Conversation not found.',
  CONVERSATION_MESSAGE_DOES_NOT_EXIST: 'Conversation message does not exist.',
  CONVERSATION_MESSAGE_FETCHED_SUCCESSFULLY: ' Conversation message fetched successfully.',
};

export const CONVERSATION_MESSAGE_MESSAGES = {
  MESSAGE_NOT_FOUND_WITH_CONVERSATION_AND_MESSAGE_ID:
    'Message with the specified message ID and conversation ID was not found.',
};

export const CONTROLLER_MESSAGE = {
  SUCCESS: 'Success',
};

export const HTTP_STATUS_MESSAGE = {
  UNAUTHORIZED: 'Unauthorized',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Conflict',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};
