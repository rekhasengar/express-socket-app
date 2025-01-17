export type UserMessagesResponse = {
  senderKey: number;
  message: string;
  createAt: Date;
};

export type PaginationMetaData = {
  totalMessageCount: number;
  messagePerPage: number;
};

export type MessageResponse = {
  message: Array<UserMessagesResponse>;
  metaData: PaginationMetaData;
};
