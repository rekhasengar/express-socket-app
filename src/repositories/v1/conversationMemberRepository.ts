import { Repository } from 'typeorm';

import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';
import RolesEnum from '@src/enums/rolesEnum';

export default class ConversationMemberRepository {
  private _conversationMemberModel: Repository<ConversationMemberModel>;

  constructor() {
    this._conversationMemberModel = AppDataSource.getRepository(ConversationMemberModel);
  }

  public async insertConversationMembers(conversationMemberModels: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberModel.insert(conversationMemberModels);
  }

  public async updateByConversationMemberId(
    conversationMemberId: string,
    model: Partial<ConversationMemberModel>,
  ): Promise<void> {
    await this._conversationMemberModel.update(
      {
        id: conversationMemberId,
      },
      model,
    );
  }

  public async deleteByConversationMemberId(conversationMemberId: string): Promise<void> {
    await this._conversationMemberModel.delete({
      id: conversationMemberId,
    });
  }

  public async getAdminMemberCountByConversationId(conversationId: string): Promise<number> {
    return await this._conversationMemberModel.count({
      where: {
        conversation: {
          id: conversationId,
        },
        role: {
          name: RolesEnum.ADMIN,
        },
      },
    });
  }

  public async getFirstUserMemberByConversationId(conversationId: string): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberModel.findOne({
      where: {
        conversation: {
          id: conversationId,
        },
        role: {
          name: RolesEnum.USER,
        },
      },
      order: { createAt: 'ASC' },
    });
  }
}
