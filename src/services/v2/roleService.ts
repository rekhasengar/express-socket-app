import HttpStatusCode from 'http-status-codes';

import { getMessage } from '@src/config/messages';
import { ACTION_MESSAGE, LOGS } from '@src/constants';
import { ROLE_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';
import RoleRepository from '@src/repositories/v2/roleRepository';
import { RoleResponse, UserRole } from '@src/types/response/roleResponse';
import { CustomErrorHandler } from '@src/helpers/customErrorHandler';
import { RoleModel } from '@src/database/mysql/models/roleModel';

export default class RoleService {
  private readonly _roleRepository: RoleRepository;

  constructor() {
    this._roleRepository = new RoleRepository();
  }

  public async getAllRoles(context: RequestContext, locale: string): Promise<RoleResponse> {
    const userRole: Array<RoleModel> = await this._roleRepository.getAllRoles();
    if (!userRole) {
      context.logError({
        source: LOGS.ERROR_MESSAGE(RoleService.name, this.getAllRoles.name),
        action: getMessage(ACTION_MESSAGE.USER_ROLE_PROCESS),
        message: ROLE_MESSAGES.USER_ROLE_NOT_FOUND,
      });
      const message: string = getMessage(ROLE_MESSAGES.USER_ROLE_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.NOT_FOUND, message, ROLE_MESSAGES.USER_ROLE_NOT_FOUND);
    }

    const userRoleResponse: Array<UserRole> = new Array<UserRole>();
    for (const role of userRole) {
      userRoleResponse.push({
        key: role.key,
        name: role.name,
      });
    }

    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(RoleService.name, this.getAllRoles.name),
      action: getMessage(ACTION_MESSAGE.USER_ROLE_PROCESS),
      message: ROLE_MESSAGES.USER_ROLE_FETCHED_SUCCESSFULLY,
    });

    return {
      roles: userRoleResponse,
    };
  }

  public async getRoleByRoleId(roleId: string): Promise<RoleModel | null> {
    return await this._roleRepository.getRoleByRoleId(roleId);
  }
}
