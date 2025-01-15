import HttpStatusCode from 'http-status-codes';

import { MessageModel } from '@src/database/mysql/models/messageModel';
import MessageRepository from '@src/repositories/v2/messageRepository';
import CustomError from '@src/shared/errorHandler/customError';
import { MessageRequest } from '@src/types/request/socketRequest';
import { MessageResponse, UserMessagesResponse } from '@src/types/response/messageResponse';
import { CONVERSATION_MESSAGES } from '@src/constants/messages';
import MessageDto from '@src/dtos/messageDto';

export default class MessageService {
  private readonly _messageRepository: MessageRepository;

  constructor() {
    this._messageRepository = new MessageRepository();
  }

  public async insertMessage(
    messageRequest: MessageRequest,
    conversationKey: number,
    senderKey: number,
  ): Promise<void> {
    const messageModel = new MessageModel();
    messageModel.createAt = new Date(messageRequest.timestamp);
    messageModel.conversationKey = conversationKey;
    messageModel.senderKey = senderKey;
    messageModel.id = messageRequest.id;
    messageModel.message = messageRequest.message;
    await this._messageRepository.insertMessage(messageModel);
  }

  public async deleteSingleMessage(senderId: string, messageId: string, conversationId: string): Promise<void> {
    await this._messageRepository.deleteSingleMessage(senderId, messageId, conversationId);
  }

  public async getMessagesByConversationId(messageDto: MessageDto): Promise<MessageResponse> {
    const conversationMessages = await this._messageRepository.getMessagesByConversationId(
      messageDto.conversationId,
      messageDto.page,
      messageDto.limit,
      ['conversation'],
    );
    if (!conversationMessages) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_NOT_FOUND);
    }

    const userMessageResponse = new Array<UserMessagesResponse>();
    for (const message of conversationMessages) {
      userMessageResponse.push({
        senderKey: message.senderKey,
        message: message.message || 'text empty',
        createAt: message.createAt,
      });
    }
    return {
      message: userMessageResponse,
    };
  }
}
