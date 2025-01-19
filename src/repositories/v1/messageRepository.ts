import { Repository } from 'typeorm';

import { MessageModel } from '@src/database/mysql/models/messageModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class MessageRepository {
  private _messageModel: Repository<MessageModel>;

  constructor() {
    this._messageModel = AppDataSource.getRepository(MessageModel);
  }

  public async saveMessage(messageModel: MessageModel): Promise<MessageModel> {
    return await this._messageModel.save(messageModel);
  }

  public async getMessagesByConversationId(
    conversationId: string,
    page: number,
    limit: number,
    relations?: Array<string>,
  ): Promise<{ messages: Array<MessageModel> | null; totalMessageCount: number }> {
    // its work like (1-1)* 10 ->> 0 skip data
    //(2-1)*10 -->> 10 skip data
    const skip = (page - 1) * limit;

    const [messages, totalMessageCount] = await this._messageModel.findAndCount({
      where: {
        conversation: {
          id: conversationId,
        },
      },
      relations,
      order: {
        createAt: 'DESC',
      },
      skip,
      take: limit,
    });
    return { messages, totalMessageCount };
  }

  public async getMessageByConversationIdMessageIdAndUserId(
    conversationId: string,
    messageId: string,
    userId: string,
    relations?: string[],
  ): Promise<MessageModel | null> {
    return await this._messageModel.findOne({
      where: {
        id: messageId,
        conversation: { id: conversationId, members: { user: { id: userId } } },
      },
      relations,
    });
  }
}
