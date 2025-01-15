export type UserMessagesResponse = {
  senderKey: number;
  message: string;
  createAt: Date;
};

export type MessageResponse = {
  message: Array<UserMessagesResponse>;
};
