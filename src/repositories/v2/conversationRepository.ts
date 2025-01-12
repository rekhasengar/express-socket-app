import { Repository } from 'typeorm';

import { AppDataSource } from '@src/database/mysql/typeormConfig';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';

export default class ConversationRepository {
  private _conversationModel: Repository<ConversationModel>;

  constructor() {
    this._conversationModel = AppDataSource.getRepository(ConversationModel);
  }

  public async getByConversationId(conversationId: string, relations?: string[]): Promise<ConversationModel | null> {
    return await this._conversationModel.findOne({ where: { id: conversationId }, relations });
  }

  public async saveConversation(conversationModel: ConversationModel): Promise<ConversationModel> {
    return await this._conversationModel.save(conversationModel);
  }
}
