export type MessageQueryRequest = {
  page?: number;
  limit?: number;
};

export type MessagePathRequest = {
  conversationId: string;
} & MessageQueryRequest;
