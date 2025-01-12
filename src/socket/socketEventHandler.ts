import ConversationService from '@service/v2/conversationService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { SocketModel } from '@src/database/mysql/models/socketModel';
import SocketEventEnum from '@src/enums/socketEventEnum';
import { EventRequest, ReceiveMessageEventRequest, SendMessageEventRequest } from '@src/types/request/socketRequest';
import MessageService from '@service/v2/messageService';
import SocketConnector from './socketConnector';

export default class SocketEventHandler {
  private readonly _conversationService: ConversationService;
  private readonly _messageService: MessageService;

  constructor() {
    this._conversationService = new ConversationService();
    this._messageService = new MessageService();
  }

  public async processSendMessageEvent(sendMessageEventRequest: SendMessageEventRequest): Promise<void> {
    const { conversationId, message } = sendMessageEventRequest;
    let { userId } = sendMessageEventRequest;
    const dbConversation = await this._conversationService.getByConversationId(conversationId, [
      'members',
      'members.user',
      'members.user.sockets',
    ]);
    if (!dbConversation) {
      throw new Error('Conversation not found');
    }

    userId = userId.toLowerCase();
    const dbUser = dbConversation.members.find(
      (conversationMember: ConversationMemberModel): boolean => conversationMember.user.id.toLowerCase() == userId,
    );
    if (!dbUser) {
      throw new Error('You are not in this conversation.');
    }

    await this._messageService.insertMessage(message, dbConversation.key, dbUser.key);
    const receiveMessageRequest: ReceiveMessageEventRequest = {
      senderId: userId,
      conversationId,
      message,
    };
    for (const member of dbConversation.members) {
      this._emitEventToSocketConnections(member.user.sockets, SocketEventEnum.ReceiveMessage, receiveMessageRequest);
    }
  }

  private _emitEventToSocketConnections(
    sockets: SocketModel[],
    eventType: SocketEventEnum,
    eventRequest: EventRequest,
  ): void {
    if (!sockets.length) return;
    for (const socket of sockets) {
      SocketConnector.emitEvent(socket.socketId, eventType, eventRequest);
    }
  }

  // public emitEventToUsers(users: UserModel[], eventType: SocketEventEnum, request: EventRequest): void {
  //   if (!users.length) return;
  //   for (const user of users) {
  //     this._emitEventToSocketConnections(user.sockets, eventType, request);
  //   }
  // }
}
