export type CreateConversationRequest = {
  userIds: Array<string>;
  groupName?: string;
  isGroupChat?: boolean;
};

export type DeleteSingleConversationRequest = {
  senderId: string;
  messageId: string;
  conversationId: string;
};

export type DeleteConversationMessagePathParams = {
  conversationId: string;
  messageId: string;
};

export type GetConversationPathParams = {
  conversationId: string;
};
