import RequestContext from '@src/helpers/context';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';

export default class MessageDto {
  conversationId: string;
  page: number;
  limit: number;
  context: RequestContext;

  constructor(params: MessagePathRequest, query: MessageQueryRequest, context: RequestContext) {
    this.conversationId = params.conversationId;
    this.page = query.page || 1;
    this.limit = query.limit || 10;
    this.context = context;
  }
}
