import { Repository } from 'typeorm';

import { SocketModel } from '@src/database/mysql/models/socketModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class SocketRepository {
  private _socketModel: Repository<SocketModel>;

  constructor() {
    this._socketModel = AppDataSource.getRepository(SocketModel);
  }

  public async getSocketIdsByConversationId(conversationId: number): Promise<Array<SocketModel>> {
    return await this._socketModel.find({
      where: { conversationKey: conversationId },
      select: { socketId: true, userKey: true, user: { firstName: true, lastName: true } },
    });
  }
}
