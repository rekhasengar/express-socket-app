import RequestContext from '@src/helpers/context';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';

export class CreateConversationDto {
  adminId: string;
  groupName?: string;
  userIds: Array<string>;
  context: RequestContext;
  locale: string;
  isGroupChat?: boolean;

  constructor(body: CreateConversationRequest, adminId: string, context: RequestContext, locale: string) {
    this.adminId = adminId;
    this.userIds = body.userIds;
    this.groupName = body.groupName;
    this.isGroupChat = body.isGroupChat;
    this.context = context;
    this.locale = locale;
  }
}

export class DeleteConversationMessageDto {
  messageId: string;
  conversationId: string;
  userId: string;
  context: RequestContext;

  constructor(pathParams: DeleteConversationMessagePathParams, userId: string, context: RequestContext) {
    this.messageId = pathParams.messageId;
    this.conversationId = pathParams.conversationId;
    this.userId = userId;
    this.context = context;
  }
}

export class GetConversationMessageDto {
  userId: string;
  context: RequestContext;
  locale: string;

  constructor(userId: string, context: RequestContext, locale: string) {
    this.userId = userId;
    this.context = context;
    this.locale = locale;
  }
}
