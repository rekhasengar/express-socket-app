import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';

export class CreateConversationDto {
  adminId: string;
  groupName: string;
  usersId: Array<string>;

  constructor(body: CreateConversationRequest, adminId: string) {
    this.adminId = adminId;
    this.usersId = body.userId;
    this.groupName = body.groupName || 'group chat';
  }
}

export class DeleteConversationMessageDto {
  messageId: string;
  conversationId: string;
  userId: string;

  constructor(pathParams: DeleteConversationMessagePathParams, userId: string) {
    this.messageId = pathParams.messageId;
    this.conversationId = pathParams.conversationId;
    this.userId = userId;
  }
}
