import { MessageStatusModel } from '@src/database/mysql/models/messageStatusModel';
import { MessageStatusRepository } from '@src/repositories/v1/messageStatusRepository';

export default class MessageStatusService {
  private readonly _messageStatusRepository: MessageStatusRepository;

  constructor() {
    this._messageStatusRepository = new MessageStatusRepository();
  }

  public async insertMessageStatus(messageStatusModel: MessageStatusModel): Promise<void> {
    await this._messageStatusRepository.insertMessageStatus(messageStatusModel);
  }

  public async deleteMessageStatusByMessageKey(messageKey: number): Promise<void> {
    await this._messageStatusRepository.deleteMessageStatusByMessageKey(messageKey);
  }
}
