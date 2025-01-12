import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { UserModel } from '@src/database/mysql/models/userModel';

export type ConversationResponse<T = any> = {
  message: string;
  body?: T;
};

export type GetActiveUsersResponse = {
  users: Array<UserModel>;
};

export type GetConversationsResponse = {
  conversations: Array<ConversationModel>;
};
