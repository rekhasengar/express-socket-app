import { Repository } from 'typeorm';

import { MessageStatusModel } from '@src/database/mysql/models/messageStatusModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export class MessageStatusRepository {
  private _messageStatusModel: Repository<MessageStatusModel>;

  constructor() {
    this._messageStatusModel = AppDataSource.getRepository(MessageStatusModel);
  }

  public async insertMessageStatus(messageStatusModel: MessageStatusModel): Promise<void> {
    await this._messageStatusModel.insert(messageStatusModel);
  }
}
