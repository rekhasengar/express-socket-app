import { MessageModel } from '@src/database/mysql/models/messageModel';
import MessageRepository from '@src/repositories/v1/messageRepository';
import { MessageRequest } from '@src/types/request/socketRequest';
import { MessageResponse, UserMessagesResponse } from '@src/types/response/messageResponse';
import { CONVERSATION_MESSAGES } from '@src/constants/messages';
import MessageDto from '@src/dtos/messageDto';
import { LOGS } from '@src/constants';
import CustomError from '@src/shared/errorHandler/customError';

export default class MessageService {
  private readonly _messageRepository: MessageRepository;

  constructor() {
    this._messageRepository = new MessageRepository();
  }

  public async saveMessage(
    messageRequest: MessageRequest,
    conversationKey: number,
    senderKey: number,
  ): Promise<MessageModel> {
    const messageModel: MessageModel = new MessageModel();
    messageModel.createAt = new Date(messageRequest.timestamp);
    messageModel.conversationKey = conversationKey;
    messageModel.senderKey = senderKey;
    messageModel.id = messageRequest.id;
    messageModel.message = messageRequest.message;
    return await this._messageRepository.saveMessage(messageModel);
  }

  public async deleteSingleMessage(senderId: string, messageId: string, conversationId: string): Promise<void> {
    await this._messageRepository.deleteSingleMessage(senderId, messageId, conversationId);
  }

  public async getUserMessage(messageDto: MessageDto): Promise<MessageResponse> {
    const { conversationId, page, limit, context } = messageDto;

    const { messages, totalMessageCount } = await this._messageRepository.getMessagesByConversationId(
      conversationId,
      page,
      limit,
      ['conversation'],
    );
    if (!messages) {
      throw CustomError.getNotFoundError(CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DOES_NOT_EXIST);
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
      source: LOGS.GET_SOURCE(MessageService.name, this.getUserMessage.name),
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

  public async getMessageByConversationIdMessageIdAndUserId(
    conversationId: string,
    messageId: string,
    userId: string,
    relations?: string[],
  ): Promise<MessageModel | null> {
    return await this._messageRepository.getMessageByConversationIdMessageIdAndUserId(
      conversationId,
      messageId,
      userId,
      relations,
    );
  }
}
