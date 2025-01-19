import { Router } from 'express';

import { PathParams, ResponseBody, RequestBody, QueryParams } from '@src/shared/types/customExpressRequest';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import UserController from '@src/controllers/v1/userController';
import { API_ROUTE } from '@src/constants';
import { UserUpdateRequest } from '@src/types/request/userRequest';

const userRoute = Router();
const userController = new UserController();

userRoute.get<PathParams, ResponseBody<GetAllUsersResponse>, RequestBody, QueryParams>('/', (...args): void => {
  userController.getAllUsers(...args);
});

userRoute.put<PathParams, ResponseBody<UpdateUserResponse>, RequestBody<UserUpdateRequest>, QueryParams>(
  '/',
  (...args): void => {
    userController.updateUser(...args);
  },
);

userRoute.get<PathParams, ResponseBody<GetUserResponse>, RequestBody, QueryParams>('/singleUser', (...args): void => {
  userController.getUser(...args);
});

userRoute.delete<PathParams, ResponseBody<DeleteUserResponse>, RequestBody, QueryParams>('/', (...args): void => {
  userController.deleteUser(...args);
});

module.exports = { router: userRoute, basePath: API_ROUTE.USERS };
