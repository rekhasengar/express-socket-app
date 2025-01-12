import { Repository } from 'typeorm';

import { SocketModel } from '@src/database/mysql/models/socketModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class SocketRepository {
  private _socketModel: Repository<SocketModel>;

  constructor() {
    this._socketModel = AppDataSource.getRepository(SocketModel);
  }

  public async insert(socketModel: SocketModel): Promise<void> {
    await this._socketModel.insert(socketModel);
  }

  public async remove(socketId: string): Promise<void> {
    await this._socketModel.delete({ socketId });
  }
}
