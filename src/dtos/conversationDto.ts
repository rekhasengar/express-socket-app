import { CreateConversationRequest } from '@src/types/request/conversationRequest';

export class CreateConversationDto {
  adminId: number;
  groupName: string;
  usersId: Array<number>;

  constructor(body: CreateConversationRequest) {
    this.adminId = body.adminId;
    this.usersId = body.userId;
    this.groupName = body.groupName || 'group chat';
  }
}
