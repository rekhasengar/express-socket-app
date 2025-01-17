import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import ConversationMemberRepository from '@src/repositories/v2/conversationMemberRepository';

export default class ConversationMemberService {
  private readonly _conversationMemberRepository: ConversationMemberRepository;

  constructor() {
    this._conversationMemberRepository = new ConversationMemberRepository();
  }

  public async insertConversationMembers(conversationMemberModels: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberRepository.insertConversationMembers(conversationMemberModels);
  }

  public async updateByConversationMemberId(
    conversationMemberId: string,
    model: Partial<ConversationMemberModel>,
  ): Promise<void> {
    await this._conversationMemberRepository.updateByConversationMemberId(conversationMemberId, model);
  }

  public async deleteByConversationMemberId(conversationMemberId: string): Promise<void> {
    await this._conversationMemberRepository.deleteByConversationMemberId(conversationMemberId);
  }

  public async getAdminMemberCountByConversationId(conversationId: string): Promise<number> {
    return await this._conversationMemberRepository.getAdminMemberCountByConversationId(conversationId);
  }

  public async getFirstUserMemberByConversationId(conversationId: string): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberRepository.getFirstUserMemberByConversationId(conversationId);
  }
}
