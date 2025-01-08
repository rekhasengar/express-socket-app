import { FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

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

  public async getUserById(where: FindOptionsWhere<UserModel>): Promise<UserModel | null> {
    return await this._userModel.findOne({ where });
  }

  public async saveUser(user: UserModel): Promise<void> {
    await this._userModel.save(user);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userModel.insert(user);
  }
}
