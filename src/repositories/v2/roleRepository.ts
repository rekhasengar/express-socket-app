import { Repository } from 'typeorm';

import { RoleModel } from '@src/database/mysql/models/roleModel';
import { AppDataSource } from '@src/database/mysql/typeormConfig';

export default class RoleRepository {
  private _roleModel: Repository<RoleModel>;

  constructor() {
    this._roleModel = AppDataSource.getRepository(RoleModel);
  }

  public async addOrUpdateRoles(roleModels: RoleModel[]): Promise<void> {
    await this._roleModel.save(roleModels);
  }
}
