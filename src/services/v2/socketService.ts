import { SocketModel } from '@src/database/mysql/models/socketModel';
import SocketRepository from '@src/repositories/v2/socketRepository';

export default class SocketService {
  private _socketRepository: SocketRepository;

  constructor(socketRepository: SocketRepository) {
    this._socketRepository = socketRepository;
  }

  public async getSocketIdsByConversationId(conversationId: number): Promise<Array<SocketModel>> {
    return await this._socketRepository.getSocketIdsByConversationId(conversationId);
  }
}
