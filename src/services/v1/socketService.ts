import { SocketModel } from '@src/database/mysql/models/socketModel';
import SocketRepository from '@src/repositories/v1/socketRepository';

export default class SocketService {
  private readonly _socketRepository: SocketRepository;

  constructor() {
    this._socketRepository = new SocketRepository();
  }

  public async createSocketModel(socketId: string, userKey: number): Promise<void> {
    const socketModel: SocketModel = new SocketModel();
    socketModel.socketId = socketId;
    socketModel.userKey = userKey;
    await this._socketRepository.insert(socketModel);
  }

  public async removeSocket(socketId: string): Promise<void> {
    await this._socketRepository.remove(socketId);
  }
}
