import { FindOptionsWhere, Repository } from 'typeorm';

import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class ConversationMemberRepository {
  private _conversationMemberModel: Repository<ConversationMemberModel>;

  constructor() {
    this._conversationMemberModel = AppDataSource.getRepository(ConversationMemberModel);
  }

  public async insertConversationMembers(conversationMemberModels: ConversationMemberModel[]): Promise<void> {
    await this._conversationMemberModel.insert(conversationMemberModels);
  }

  public async checkUserAlreadyExistsInConversation(
    userId: string,
    conversationId: number,
  ): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberModel.findOne({
      where: { conversationKey: conversationId, id: userId },
    });
  }

  public async addUserInConversationMember(data: ConversationMemberModel): Promise<void> {
    await this._conversationMemberModel.insert(data);
  }

  public async addUsersInConversationMember(data: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberModel.insert(data);
  }

  public async getConversationMemberDetailById(userId: number): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberModel.findOne({
      where: { userKey: userId },
    });
  }

  public async getAdminIdFromSingleConversation(
    conversationId: number,
    roleId: number,
  ): Promise<Array<ConversationMemberModel>> {
    return await this._conversationMemberModel.find({
      where: {
        conversationKey: conversationId,
        roleKey: roleId,
      },
      select: {
        userKey: true,
      },
    });
  }

  public async deleteSingleConversation(where: FindOptionsWhere<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberModel.delete(where);
  }
}
