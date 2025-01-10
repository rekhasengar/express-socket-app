import { Repository } from 'typeorm';

import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class ConversationMemberRepository {
  private _conversationMemberModel: Repository<ConversationMemberModel>;

  constructor() {
    this._conversationMemberModel = AppDataSource.getRepository(ConversationMemberModel);
  }

  public async checkUserAlreadyExistsInConversation(
    userId: number,
    conversationId: number,
  ): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberModel.findOne({
      where: { conversationKey: conversationId, userKey: userId },
    });
  }

  public async addUsersInConversationMember(data: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberModel.insert(data);
  }

  public async addUserInConversationMember(data: ConversationMemberModel): Promise<void> {
    await this._conversationMemberModel.insert(data);
  }
}
