import { ConversationModel } from '@src/database/mysql/models/conversationModel';

export type ConversationResponse<T = any> = {
  message: string;
  body?: T;
};

export type GetConversationsResponse = {
  conversations: Array<ConversationModel>;
};

