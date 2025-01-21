import { In, Repository } from 'typeorm';

import { AppDataSource } from '@src/database/mysql/typeormConfig';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';

export default class ConversationRepository {
  private _conversationModel: Repository<ConversationModel>;

  constructor() {
    this._conversationModel = AppDataSource.getRepository(ConversationModel);
  }

  public async getConversationByConversationId(
    conversationId: string,
    relations?: Array<string>,
  ): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({ where: { id: conversationId }, relations });
  }

  public async getConversationByConversationIdForApi(conversationId: string): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({
      select: {
        name: true,
        isGroupChat: true,
        id: true,
        key: true,
        members: {
          id: true,
          key: true,
          role: {
            id: true,
            key: true,
            name: true,
          },
          user: {
            id: true,
            key: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      where: { id: conversationId },
      relations: ['members', 'members.user'],
    });
  }

  public async saveConversation(conversationModel: ConversationModel): Promise<ConversationModel> {
    return await this._conversationModel.save(conversationModel);
  }

  public async updateByConversationId(
    conversationId: string,
    conversationModel: Partial<ConversationModel>,
  ): Promise<void> {
    await this._conversationModel.update(
      {
        id: conversationId,
      },
      conversationModel,
    );
  }

  public async getConversationByConversationIdAndUserIds(
    conversationId: string,
    userIds: Array<string>,
    relations?: Array<string>,
  ): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({
      where: {
        id: conversationId,
        members: {
          user: {
            id: In([userIds]),
          },
        },
      },
      relations,
    });
  }

  public async getConversationByConversationIdAndUserIdAndMessageId(
    conversationId: string,
    userId: string,
    messageId: string,
  ): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({
      where: {
        id: conversationId,
        messages: {
          id: messageId,
          sender: {
            id: userId,
          },
        },
      },
      relations: ['messages', 'messages.sender'],
    });
  }

  public async getConversationUsersByConversationIdForApi(conversationId: string): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({
      where: {
        id: conversationId,
      },
      select: {
        id: true,
        key: true,
        members: {
          key: true,
          user: {
            key: true,
            id: true,
            firstName: true,
            lastName: true,
          },
          role: {
            key: true,
            name: true,
          },
        },
      },
      relations: ['members', 'members.role', 'members.user'],
    });
  }
}
