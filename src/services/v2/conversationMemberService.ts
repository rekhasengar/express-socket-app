import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import ConversationMemberRepository from '@src/repositories/v2/conversationMemberRepository';

export default class ConversationMemberService {
  private _conversationMemberRepository: ConversationMemberRepository;

  constructor(conversationMemberRepository: ConversationMemberRepository) {
    this._conversationMemberRepository = conversationMemberRepository;
  }

  public async checkUserAlreadyExistsInConversation(
    userId: number,
    conversationId: number,
  ): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberRepository.checkUserAlreadyExistsInConversation(userId, conversationId);
  }

  public async addUsersInConversationMember(data: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberRepository.addUsersInConversationMember(data);
  }

  public async addUserInConversationMember(data: ConversationMemberModel): Promise<void> {
    await this._conversationMemberRepository.addUserInConversationMember(data);
  }
}
