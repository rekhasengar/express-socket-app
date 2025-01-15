import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import ConversationMemberRepository from '@src/repositories/v2/conversationMemberRepository';

export default class ConversationMemberService {
  private _conversationMemberRepository: ConversationMemberRepository;

  constructor() {
    this._conversationMemberRepository = new ConversationMemberRepository();
  }

  public async insertConversationMembers(conversationMemberModels: ConversationMemberModel[]): Promise<void> {
    await this._conversationMemberRepository.insertConversationMembers(conversationMemberModels);
  }
}
