import { FindOptionsSelect, FindOptionsWhere, In, Repository } from 'typeorm';

import { UserModel } from '@src/database/mysql/models/userModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class UserRepository {
  private _userModel: Repository<UserModel>;

  constructor() {
    this._userModel = AppDataSource.getRepository(UserModel);
  }

  public async getCurrentActiveAllUsers(
    where: FindOptionsWhere<UserModel>,
    select: FindOptionsSelect<UserModel>,
  ): Promise<Array<UserModel>> {
    return await this._userModel.find({ where, select });
  }

  public async getUser(where: FindOptionsWhere<UserModel>): Promise<UserModel | null> {
    return await this._userModel.findOne({ where });
  }

  public async getUserById(userId: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: { id: userId },
    });
  }

  public async updateUserByUserId(where: FindOptionsWhere<UserModel>, data: Partial<UserModel>): Promise<void> {
    await this._userModel.update(where, data);
  }

  public async getAllUserById(userIds: Array<string>): Promise<Array<UserModel>> {
    return await this._userModel.find({
      where: {
        id: In(userIds),
      },
      select: {
        key: true,
        id: true,
      },
    });
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this._userModel.findOne({
      where: { email: email },
    });
  }

  public async saveUser(user: UserModel): Promise<UserModel> {
    return await this._userModel.save(user);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userModel.insert(user);
  }
}
