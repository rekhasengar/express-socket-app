import { FindManyOptions, Repository } from 'typeorm';

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
  ): Promise<{ messages: Array<MessageModel>; totalCount: number }> {
    // its work like (1-1)* 10 ->> 0 skip data
    //(2-1)*10 -->> 10 skip data
    const skip = (page - 1) * limit;

    const options: FindManyOptions<MessageModel> = {
      select: {
        id: true,
        key: true,
        message: true,
        createAt: true,
        messageStatuses: {
          id: true,
          key: true,
          status: true,
          timestamp: true,
          timezone: true,
          user: {
            id: true,
            key: true,
            firstName: true,
            lastName: true,
          },
        },
        sender: {
          id: true,
          key: true,
          firstName: true,
          lastName: true,
        },
      },
      where: {
        conversation: {
          id: conversationId,
        },
      },
      relations: ['messageStatuses', 'messageStatuses.user', 'sender'],
      order: {
        createAt: 'ASC',
      },
      skip,
      take: limit,
    };

    const [messages, totalCount] = await Promise.all([
      this._messageModel.find(options),
      this._messageModel.count({ where: options.where }),
    ]);

    return { messages, totalCount };
  }

  public async getMessageByConversationIdMessageIdAndUserId(
    conversationId: string,
    messageId: string,
    userId: string,
    relations?: Array<string>,
  ): Promise<MessageModel | null> {
    return await this._messageModel.findOne({
      where: {
        id: messageId,
        conversation: { id: conversationId, members: { user: { id: userId } } },
      },
      relations,
    });
  }

  public async deleteUserMessageByMessageId(messageId: string): Promise<void> {
    await this._messageModel.delete({ id: messageId });
  }
}
