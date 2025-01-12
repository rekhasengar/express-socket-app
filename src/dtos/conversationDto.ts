import { CreateConversationRequest, DeleteSingleConversationRequest } from '@src/types/request/conversationRequest';

export class CreateConversationDto {
  adminId: string;
  groupName: string;
  usersId: Array<string>;

  constructor(body: CreateConversationRequest) {
    this.adminId = body.adminId;
    this.usersId = body.userId;
    this.groupName = body.groupName || 'group chat';
  }
}

export class DeleteConversationDto {
  messageId: number;
  senderId: number;

  constructor(body: DeleteSingleConversationRequest) {
    this.messageId = body.messageId;
    this.senderId = body.senderId;
  }
}
