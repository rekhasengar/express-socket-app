import { Repository } from 'typeorm';

import { RoleModel } from '@src/database/mysql/models/roleModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class RoleRepository {
  private _roleModel: Repository<RoleModel>;

  constructor() {
    this._roleModel = AppDataSource.getRepository(RoleModel);
  }

  public async addRole(data: RoleModel): Promise<void> {
    await this._roleModel.insert(data);
  }

  public async getAllRoleList(): Promise<Array<RoleModel>> {
    return await this._roleModel.find();
  }
}
