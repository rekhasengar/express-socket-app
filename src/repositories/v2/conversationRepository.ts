import { Repository } from 'typeorm';

import { AppDataSource } from '@src/database/mysql/typeormConfig';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';

export default class ConversationRepository {
  private _conversationModel: Repository<ConversationModel>;

  constructor() {
    this._conversationModel = AppDataSource.getRepository(ConversationModel);
  }

  public async checkGroupExistsOrNot(conversationId: number): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({ where: { key: conversationId } });
  }

  public async addConversation(data: ConversationModel): Promise<ConversationModel> {
    return await this._conversationModel.save(data);
  }
}
