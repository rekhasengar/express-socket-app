import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import UserService from '@service/v1/userService';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomError from '@src/shared/errorHandler/customError';
import CustomRequest from '@src/shared/types/customExpressRequest';
import EmptyObject from '@src/types/request/emptyObject';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetSingleUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import { UserUpdateRequest } from '@src/types/request/userRequest';
import { DeleteUserDto, GetUserDto, UpdateUserDto } from '@src/dtos/userDto';

export default class UserController {
  private readonly _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }
  public async getAllRegisterUserList(
    req: CustomRequest<EmptyObject, GetAllUsersResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetAllUsersResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<GetAllUsersResponse>();
    try {
      const responseFromService = await this._userService.getAllRegisterUserList(req.context);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async updateUserDetails(
    req: CustomRequest<EmptyObject, UpdateUserResponse, UserUpdateRequest, EmptyObject>,
    res: Response<ApiResponse<UpdateUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<UpdateUserResponse>();

    try {
      const updateUserDto = new UpdateUserDto(req.app.locals.userId, req.body, req.context);
      const responseFromService = await this._userService.updateUserDetails(updateUserDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getUser(
    req: CustomRequest<EmptyObject, GetSingleUserResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetSingleUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<GetSingleUserResponse>();

    try {
      const getUserDto = new GetUserDto(req.app.locals.userId, req.context);
      const responseFromService = await this._userService.getUser(getUserDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async deleteUser(
    req: CustomRequest<EmptyObject, DeleteUserResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<DeleteUserResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<DeleteUserResponse>();

    try {
      const deleteUserDto = new DeleteUserDto(req.app.locals.userId, req.context);
      const responseFromService = await this._userService.deleteUser(deleteUserDto);
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
