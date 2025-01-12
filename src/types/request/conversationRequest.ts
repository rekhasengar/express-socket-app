export type CreateConversationRequest = {
  userId: Array<string>;
  adminId: string;
  groupName?: string;
};

export type DeleteSingleConversationRequest = {
  senderId: number;
  messageId: number;
};
