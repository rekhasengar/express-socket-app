import { LOGS } from '@src/constants';
import { ROLE_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';
import RoleRepository from '@src/repositories/v1/roleRepository';
import { RoleResponse, UserRole } from '@src/types/response/roleResponse';
import { RoleModel } from '@src/database/mysql/models/roleModel';
import CustomError from '@src/shared/errorHandler/customError';

export default class RoleService {
  private readonly _roleRepository: RoleRepository;

  constructor() {
    this._roleRepository = new RoleRepository();
  }

  public async getAllRoles(context: RequestContext): Promise<RoleResponse> {
    const userRoles: Array<RoleModel> = await this._roleRepository.getAllRoles();
    if (!userRoles) {
      throw CustomError.getNotFoundError(ROLE_MESSAGES.USER_ROLES_COULD_NOT_BE_FOUND);
    }

    const userRoleResponse: Array<UserRole> = new Array<UserRole>();
    for (const role of userRoles) {
      userRoleResponse.push({
        key: role.key,
        name: role.name,
      });
    }

    context.logInfo({
      source: LOGS.GET_SOURCE(RoleService.name, this.getAllRoles.name),
      message: ROLE_MESSAGES.USER_ROLES_RETRIEVED_SUCCESSFULLY,
    });

    return {
      roles: userRoleResponse,
    };
  }

  public async getRoleByRoleId(roleId: string): Promise<RoleModel | null> {
    return await this._roleRepository.getRoleByRoleId(roleId);
  }
}
