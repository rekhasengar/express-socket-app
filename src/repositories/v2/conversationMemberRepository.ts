import { Repository } from 'typeorm';

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
}
