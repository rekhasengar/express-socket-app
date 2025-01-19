import { ConversationModel } from '@src/database/mysql/models/conversationModel';

export type ConversationResponse<T = any> = {
  message: string;
};

export type GetConversationsResponse = {
  conversations: Array<ConversationModel>;
};

export type GetConversationMessageResponse = {
  message: Array<UserMessagesResponse>;
  metaData: PaginationMetaData;
};

export type UserMessagesResponse = {
  senderKey: number;
  message: string;
  createAt: Date;
};

export type PaginationMetaData = {
  totalMessageCount: number;
  messagePerPage: number;
};
