import UserRepository from '@src/repositories/v2/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async getUserByUserId(userId: string, relations?: string[]): Promise<UserModel | null> {
    return await this._userRepository.getUserByUserId(userId, relations);
  }

  public async updateUserByUserId(userId: string): Promise<void> {
    await this._userRepository.updateUserByUserId({ id: userId }, { isLoginEnabled: false });
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this._userRepository.getUserByEmail(email);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userRepository.createNewUser(user);
  }

  public async saveUser(user: UserModel): Promise<UserModel> {
    return await this._userRepository.saveUser(user);
  }

  public async getCurrentActiveAllUsers(): Promise<Array<UserModel>> {
    return await this._userRepository.getCurrentActiveAllUsers(
      { isLoginEnabled: true },
      { firstName: true, lastName: true, id: true, deleted: false },
    );
  }

  public async getAllUserByIds(userIds: Array<string>): Promise<Array<UserModel>> {
    return await this._userRepository.getAllUserById(userIds);
  }

  public async getUserConversationsForGetConversationApi(userId: string): Promise<UserModel | null> {
    return await this._userRepository.getUserConversationsForGetConversationApi(userId);
  }
}
