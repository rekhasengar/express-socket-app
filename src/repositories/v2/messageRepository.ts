import { FindOptionsWhere, Repository } from 'typeorm';

import { MessageModel } from '@src/database/mysql/models/messageModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class MessageRepository {
  private _messageModel: Repository<MessageModel>;

  constructor() {
    this._messageModel = AppDataSource.getRepository(MessageModel);
  }

  public async insertMessage(messageModel: MessageModel): Promise<void> {
    await this._messageModel.insert(messageModel);
  }

  public async deleteSingleMessage(where: FindOptionsWhere<MessageModel>): Promise<void> {
    await this._messageModel.delete(where);
  }
}
