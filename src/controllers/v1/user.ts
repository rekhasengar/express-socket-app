import { Request, Response } from 'express';

import UserService from '@service/user';
import ResponseHandler from '@src/helpers/responseHandler';

export default class UserController {
  private readonly _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    const responseHandler = new ResponseHandler(req, res);
    const queryParams = req.query;
    const getUsersRequest = {
      page: parseInt(queryParams.page as string),
      limit: parseInt(queryParams.limit as string),
    };
    try {
      const response = await this._userService.getUsers(getUsersRequest);
      return responseHandler.successResponse(response);
    } catch (error) {
      return responseHandler.handleError(req.locale, error as Error);
    }
  }

  async getUser(req: Request, res: Response): Promise<Response> {
    const responseHandler = new ResponseHandler(req, res);
    const userId = req.app.locals.userId;
    try {
      const response = await this._userService.getUser(userId);
      return responseHandler.successResponse(response);
    } catch (error) {
      return responseHandler.handleError(req.locale, error as Error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const responseHandler = new ResponseHandler(req, res);
    const userId = req.app.locals.userId;
    const updateUserRequest = req.body;
    try {
      const response = await this._userService.updateUser(userId, updateUserRequest);
      return responseHandler.successResponse(response);
    } catch (error) {
      return responseHandler.handleError(req.locale, error as Error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const responseHandler = new ResponseHandler(req, res);
    const userId = parseInt(req.params.userId);
    try {
      const response = await this._userService.deleteUser(userId);
      return responseHandler.successResponse(response);
    } catch (error) {
      return responseHandler.handleError(req.locale, error as Error);
    }
  }
}
