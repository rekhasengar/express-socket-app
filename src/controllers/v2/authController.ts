import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';
import UserRegisterDto from '@src/dtos/userRegisterDto';
import UserService from '@service/v2/userService';
import { CONTROLLER_MESSAGE } from '@src/constants';
import CustomError from '@src/shared/errorHandler/customError';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { UserResponse } from '@src/types/response/userResponse';
import UserLoginDto from '@src/dtos/userLoginDto';

export default class AuthController {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  public async userRegistration(
    req: CustomRequest<EmptyObjectRequest, UserResponse, UserRegisterRequest, EmptyObjectRequest>,
    res: Response<ApiResponse<UserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<UserResponse>();

    try {
      const userRegisterDto = new UserRegisterDto(req.body);
      const responseFromService = await this._userService.registerUser(userRegisterDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async userLogin(
    req: CustomRequest<EmptyObjectRequest, UserResponse, UserLoginRequest, EmptyObjectRequest>,
    res: Response<ApiResponse<UserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<UserResponse>();

    try {
      const userLoginDto = new UserLoginDto(req.body);
      const responseFromService = await this._userService.userLogin(userLoginDto);
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
