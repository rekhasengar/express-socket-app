import HttpStatusCode from 'http-status-codes';

import { MessageModel } from '@src/database/mysql/models/messageModel';
import MessageRepository from '@src/repositories/v2/messageRepository';
import { MessageRequest } from '@src/types/request/socketRequest';
import { MessageResponse, UserMessagesResponse } from '@src/types/response/messageResponse';
import { CONVERSATION_MESSAGES } from '@src/constants/messages';
import MessageDto from '@src/dtos/messageDto';
import { ACTION_MESSAGE, LOGS } from '@src/constants';
import { getMessage } from '@src/config/messages';
import { CustomErrorHandler } from '@src/helpers/customErrorHandler';

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
    const messageModel: MessageModel = new MessageModel();
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

  public async getUserMessage(messageDto: MessageDto): Promise<MessageResponse> {
    const { conversationId, page, limit, context, locale } = messageDto;

    const { messages, totalMessageCount } = await this._messageRepository.getMessagesByConversationId(
      conversationId,
      page,
      limit,
      ['conversation'],
    );
    if (!messages) {
      context.logError({
        source: LOGS.ERROR_MESSAGE(MessageService.name, this.getUserMessage.name),
        action: ACTION_MESSAGE.CONVERSATION_MESSAGE_PROCESS,
        message: getMessage(CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_NOT_FOUND),
      });
      const message: string = getMessage(CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_NOT_FOUND, locale);
      throw new CustomErrorHandler(
        HttpStatusCode.NOT_FOUND,
        message,
        CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_NOT_FOUND,
      );
    }

    const userMessageResponse: Array<UserMessagesResponse> = new Array<UserMessagesResponse>();
    for (const message of messages) {
      userMessageResponse.push({
        senderKey: message.senderKey,
        message: message.message || 'text empty',
        createAt: message.createAt,
      });
    }

    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(MessageService.name, this.getUserMessage.name),
      action: ACTION_MESSAGE.CONVERSATION_MESSAGE_PROCESS,
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_FETCHED_SUCCESSFULLY,
    });

    return {
      message: userMessageResponse,
      metaData: {
        totalMessageCount: totalMessageCount,
        messagePerPage: userMessageResponse.length,
      },
    };
  }
}
