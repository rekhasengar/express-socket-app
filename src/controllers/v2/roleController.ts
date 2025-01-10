import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { CONTROLLER_MESSAGE } from '@src/constants';
import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomError from '@src/shared/errorHandler/customError';
import CustomRequest from '@src/shared/types/customExpressRequest';
import { RoleResponse } from '@src/types/response/roleResponse';
import { CreateRoleRequest } from '@src/types/request/roleRequest';
import RoleService from '@service/v2/roleService';
import { RoleDto } from '@src/dtos/roleDto';
import EmptyObject from '@src/types/request/emptyObject';

export default class RoleController {
  private readonly _roleService: RoleService;

  constructor(roleService: RoleService) {
    this._roleService = roleService;
  }

  public async addRole(
    req: CustomRequest<EmptyObject, RoleResponse, CreateRoleRequest, EmptyObject>,
    res: Response<ApiResponse<RoleResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<RoleResponse>();
    try {
      const roleDto = new RoleDto(req.body);
      const responseFromService = await this._roleService.addRole(roleDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }
}
