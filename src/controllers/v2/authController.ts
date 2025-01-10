import { Response, Request, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import AuthService from '@service/v2/authService';
import { CONTROLLER_MESSAGE } from '@src/constants';
import CustomError from '@src/shared/errorHandler/customError';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { RegisterUserResponse } from '@src/types/response/userResponse';
import { UserRegisterDto, UserLoginDto } from '@src/dtos/authDto';
import EmptyObject from '@src/types/request/emptyObject';

export default class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  public async registerUser(
    req: Request<EmptyObject, RegisterUserResponse, UserRegisterRequest, EmptyObject>,
    res: Response<ApiResponse<RegisterUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<RegisterUserResponse>();

    try {
      const userRegisterDto = new UserRegisterDto(req.body);
      const responseFromService = await this._authService.registerUser(userRegisterDto);
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
    req: CustomRequest<EmptyObject, RegisterUserResponse, UserLoginRequest, EmptyObject>,
    res: Response<ApiResponse<RegisterUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<RegisterUserResponse>();

    try {
      const userLoginDto = new UserLoginDto(req.body);
      const responseFromService = await this._authService.userLogin(userLoginDto);
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
