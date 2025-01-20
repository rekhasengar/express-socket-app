import { MessageModel } from '@src/database/mysql/models/messageModel';
import MessageRepository from '@src/repositories/v1/messageRepository';
import { MessageRequest } from '@src/types/request/socketRequest';
import { CONVERSATION_MESSAGES } from '@src/constants/messages';
import MessageDto from '@src/dtos/messageDto';
import { LOGS } from '@src/constants';
import { GetConversationMessagesResponse } from '@src/types/response/conversationResponse';

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

  public async getUserMessagesByConversationId(messageDto: MessageDto): Promise<GetConversationMessagesResponse> {
    const { conversationId, page, limit, context } = messageDto;

    const { messages, totalCount } = await this._messageRepository.getMessagesByConversationId(
      conversationId,
      page,
      limit,
    );

    context.logInfo({
      source: LOGS.GET_SOURCE(MessageService.name, this.getUserMessagesByConversationId.name),
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_FETCHED_SUCCESSFULLY,
    });

    return {
      messages,
      metaData: {
        totalMessageCount: totalCount,
        messagePerPage: messages.length,
      },
    };
  }

  public async getMessageByConversationIdMessageIdAndUserId(
    conversationId: string,
    messageId: string,
    userId: string,
    relations?: Array<string>,
  ): Promise<MessageModel | null> {
    return await this._messageRepository.getMessageByConversationIdMessageIdAndUserId(
      conversationId,
      messageId,
      userId,
      relations,
    );
  }

  public async deleteUserMessageByMessageId(messageId: string): Promise<void> {
    await this._messageRepository.deleteUserMessageByMessageId(messageId);
  }
}
