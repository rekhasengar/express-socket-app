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

  // public async checkUserAlreadyExistsInConversation(
  //   userId: string,
  //   conversationId: number,
  // ): Promise<ConversationMemberModel | null> {
  //   return await this._conversationMemberRepository.checkUserAlreadyExistsInConversation(userId, conversationId);
  // }

  public async addUserInConversationMember(data: ConversationMemberModel): Promise<void> {
    await this._conversationMemberRepository.addUserInConversationMember(data);
  }

  public async addUsersInConversationMember(data: Array<ConversationMemberModel>): Promise<void> {
    await this._conversationMemberRepository.addUsersInConversationMember(data);
  }

  public async getConversationMemberDetailById(userId: number): Promise<ConversationMemberModel | null> {
    return await this._conversationMemberRepository.getConversationMemberDetailById(userId);
  }

  public async getAdminIdFromSingleConversation(
    conversationId: number,
    roleId: number,
  ): Promise<Array<ConversationMemberModel>> {
    return await this._conversationMemberRepository.getAdminIdFromSingleConversation(conversationId, roleId);
  }

  public async deleteSingleConversation(conversationId: number): Promise<void> {
    await this._conversationMemberRepository.deleteSingleConversation({ key: conversationId });
  }

  // public async updateUserRole(userId: number, conversationId: number, roleId: number): Promise<void>
  // {
  //   await this._conversationMemberRepository.updateUserRole()
  // }
}
