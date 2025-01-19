import { Response, Request, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import AuthService from '@service/v1/authService';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import CustomError from '@src/shared/errorHandler/customError';
import EmptyObject from '@src/types/request/emptyObject';
import {
  AuthChangedPasswordDto,
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthLogoutDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
} from '@src/dtos/authDto';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
} from '@src/types/request/authRequest';
import { AuthLoginResponse, AuthResponse } from '@src/types/response/authResponse';

export default class AuthController {
  private readonly _authService: AuthService;

  constructor() {
    this._authService = new AuthService();
  }

  public async authRegister(
    req: Request<EmptyObject, AuthResponse, AuthRegisterRequest, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<AuthResponse> = new ApiResponse<AuthResponse>();
    try {
      const authRegisterDto: AuthRegisterDto = new AuthRegisterDto(req.body, req.context);
      const responseFromService: AuthResponse = await this._authService.authRegister(authRegisterDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async authLogin(
    req: CustomRequest<EmptyObject, AuthLoginResponse, AuthLoginRequest, EmptyObject>,
    res: Response<ApiResponse<AuthLoginResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<AuthLoginResponse> = new ApiResponse<AuthLoginResponse>();
    try {
      const authLoginDto: AuthLoginDto = new AuthLoginDto(req.body, req.context);
      const responseFromService: AuthLoginResponse = await this._authService.userLogin(authLoginDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async authLogout(
    req: CustomRequest<EmptyObject, AuthResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();

    try {
      const authLogoutDto: AuthLogoutDto = new AuthLogoutDto(req.app.locals.userId, req.context);
      const responseFromService = await this._authService.userLogout(authLogoutDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async authForgotPassword(
    req: CustomRequest<EmptyObject, AuthResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();

    try {
      const authForgotPasswordDto: AuthForgotPasswordDto = new AuthForgotPasswordDto(
        req.app.locals.userId,
        req.context,
      );
      const responseFromService = await this._authService.forgotPassword(authForgotPasswordDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async authResetPassword(
    req: CustomRequest<EmptyObject, AuthResponse, AuthResetPasswordRequest, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();

    try {
      const authResetPasswordDto: AuthResetPasswordDto = new AuthResetPasswordDto(req.body, req.context);
      const responseFromService = await this._authService.resetPassword(authResetPasswordDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async authChangePassword(
    req: CustomRequest<EmptyObject, AuthResponse, AuthChangePasswordRequest, EmptyObject>,
    res: Response<ApiResponse<AuthResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<AuthResponse>();

    try {
      const authChangedPasswordDto: AuthChangedPasswordDto = new AuthChangedPasswordDto(
        req.body,
        req.app.locals.userId,
        req.context,
      );
      const responseFromService = await this._authService.changePassword(authChangedPasswordDto);
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
