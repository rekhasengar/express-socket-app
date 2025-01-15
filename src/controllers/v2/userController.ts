import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import UserService from '@service/v2/userService';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomError from '@src/shared/errorHandler/customError';
import CustomRequest from '@src/shared/types/customExpressRequest';
import EmptyObject from '@src/types/request/emptyObject';
import { GetActiveUsersResponse, GetUserStatusResponse } from '@src/types/response/userResponse';

export default class UserController {
  private readonly _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }
  public async getAllActiveUser(
    req: CustomRequest<EmptyObject, GetActiveUsersResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetActiveUsersResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<GetActiveUsersResponse>();
    const { context } = req;

    try {
      const responseFromService = await this._userService.getAllActiveUserList(context);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getAllUserStatus(
    req: CustomRequest<EmptyObject, GetUserStatusResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetUserStatusResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<GetUserStatusResponse>();
    const { context } = req;

    try {
      const responseFromService = await this._userService.getAllUserStatus(context);
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
