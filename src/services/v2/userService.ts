import UserRepository from '@src/repositories/v2/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository;
  }

  public async getUserById(userId: number): Promise<UserModel | null> {
    return await this._userRepository.getUserById(userId);
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this._userRepository.getUserByEmail(email);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userRepository.createNewUser(user);
  }

  public async saveUser(user: UserModel): Promise<void> {
    await this._userRepository.saveUser(user);
  }

  public async getCurrentActiveAllUsers(): Promise<Array<UserModel>> {
    return await this._userRepository.getCurrentActiveAllUsers(
      { isLoginEnabled: true },
      { firstName: true, lastName: true, id: true, deleted: false },
    );
  }

  public async getAllUserById(userIds: Array<number>): Promise<Array<UserModel>> {
    return await this._userRepository.getAllUserById(userIds);
  }
}
