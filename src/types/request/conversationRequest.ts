export type CreateConversationRequest = {
  userId: Array<string>;
  groupName?: string;
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
