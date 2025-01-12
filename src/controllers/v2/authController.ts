import { Response, Request, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import AuthService from '@service/v2/authService';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import CustomError from '@src/shared/errorHandler/customError';
import { UserLoginRequest, UserLogoutPathRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { AuthResponse, UserLoginResponse } from '@src/types/response/userResponse';
import { UserRegisterDto, UserLoginDto, UserLogoutDto } from '@src/dtos/authDto';
import EmptyObject from '@src/types/request/emptyObject';

export default class AuthController {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  public async registerUser(
    req: Request<EmptyObject, AuthResponse, UserRegisterRequest, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();
    const { context } = req;

    try {
      const userRegisterDto = new UserRegisterDto(req.body);
      const responseFromService = await this._authService.registerUser(userRegisterDto, context);
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
    req: CustomRequest<EmptyObject, UserLoginResponse, UserLoginRequest, EmptyObject>,
    res: Response<ApiResponse<UserLoginResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<UserLoginResponse>();
    const { context } = req;

    try {
      const userLoginDto = new UserLoginDto(req.body);
      const responseFromService = await this._authService.userLogin(userLoginDto, context);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async userLogout(
    req: CustomRequest<UserLogoutPathRequest, AuthResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();
    const { context } = req;

    try {
      const userLogoutDto = new UserLogoutDto(req.params);
      const responseFromService = await this._authService.userLogout(userLogoutDto, context);
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
