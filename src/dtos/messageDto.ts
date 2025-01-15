import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';

export default class MessageDto {
  conversationId: string;
  page: number;
  limit: number;

  constructor(params: MessagePathRequest, query: MessageQueryRequest) {
    this.conversationId = params.conversationId;
    this.page = query.page || 1;
    this.limit = query.limit || 10;
  }
}
