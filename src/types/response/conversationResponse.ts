import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { MessageModel } from '@src/database/mysql/models/messageModel';

export type CreateConversationResponse = {
  message: string;
};

export type GetConversationsResponse = {
  conversations: Array<ConversationModel>;
};

export type GetConversationMessagesResponse = {
  messages: Array<MessageModel>;
  metaData: PaginationMetaData;
};

export type PaginationMetaData = {
  totalMessageCount: number;
  messagePerPage: number;
};

export type GetConversationResponse = {
  conversation: ConversationModel;
};
