import RoleRepository from '@src/repositories/v2/roleRepository';
import { RoleResponse, UserRole } from '@src/types/response/roleResponse';

export default class RoleService {
  private readonly _roleRepository: RoleRepository;

  constructor() {
    this._roleRepository = new RoleRepository();
  }

  public async geRoles(): Promise<RoleResponse> {
    const userRole = await this._roleRepository.getRoleKeyAndName();
    const userRoleResponse = new Array<UserRole>();
    for (const role of userRole) {
      userRoleResponse.push({
        key: role.key,
        name: role.name,
      });
    }
    return {
      roles: userRoleResponse,
    };
  }
}
