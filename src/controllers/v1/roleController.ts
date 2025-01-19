import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomError from '@src/shared/errorHandler/customError';
import CustomRequest from '@src/shared/types/customExpressRequest';
import { RoleResponse } from '@src/types/response/roleResponse';
import RoleService from '@service/v1/roleService';
import EmptyObject from '@src/types/request/emptyObject';

export default class RoleController {
  private readonly _roleService: RoleService;

  constructor() {
    this._roleService = new RoleService();
  }

  public async getAllRoles(
    req: CustomRequest<EmptyObject, RoleResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<RoleResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<RoleResponse>();

    try {
      const responseFromService = await this._roleService.getAllRoles(req.context);
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
