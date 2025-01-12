import { MessageModel } from '@src/database/mysql/models/messageModel';
import MessageRepository from '@src/repositories/v2/messageRepository';
import { MessageRequest } from '@src/types/request/socketRequest';

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

  public async deleteSingleMessage(senderId: number, messageId: number): Promise<void> {
    await this._messageRepository.deleteSingleMessage({ senderKey: senderId, key: messageId });
  }
}
