import { SUCCESS_MESSAGE } from '@src/constants';
import { RoleModel } from '@src/database/mysql/models/roleModel';
import { RoleDto } from '@src/dtos/roleDto';
import RoleRepository from '@src/repositories/v2/roleRepository';
import { RoleResponse } from '@src/types/response/roleResponse';

export default class RoleService {
  private _roleRepository: RoleRepository;

  constructor(roleRepository: RoleRepository) {
    this._roleRepository = roleRepository;
  }

  public async addRole(roleDto: RoleDto): Promise<RoleResponse> {
    const roleModel = new RoleModel();
    roleModel.name = roleDto.name;
    roleModel.description = roleDto.description;
    await this._roleRepository.addOrUpdateRoles([roleModel]);
    return {
      message: SUCCESS_MESSAGE.ROLE_ADDED_SUCCESSFULLY,
    };
  }

  public async getAllRoleList(): Promise<Array<RoleModel>> {
    return await this._roleRepository.getAllRoleList();
  }
}
