import { Router } from 'express';

import { PathParams, ResponseBody, RequestBody, QueryParams } from '@src/shared/types/customExpressRequest';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetSingleUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import { API_ROUTES } from '@src/constants';
import { UserUpdateRequest } from '@src/types/request/userRequest';
import { doValidation } from '@src/helpers/joiValidator';
import UserSchema from '../../helpers/joiValidator/schemas/user';
import { checkToken } from '@src/middlewares/checkToken';
import UserController from '@src/controllers/v1/userController';

const userRoute = Router();

userRoute.get<PathParams, ResponseBody<GetAllUsersResponse>, RequestBody, QueryParams>('/', (...args): void => {
  new UserController().getAllRegisterUserList(...args);
});

userRoute.put<PathParams, ResponseBody<UpdateUserResponse>, RequestBody<UserUpdateRequest>, QueryParams>(
  '/',
  checkToken,
  doValidation(UserSchema.UpdateUserRequest),
  (...args): void => {
    new UserController().updateUserDetails(...args);
  },
);

//decide from where we need to get userId(token/params): currently fetching userId from token
userRoute.get<PathParams, ResponseBody<GetSingleUserResponse>, RequestBody, QueryParams>(
  '/:userId',
  checkToken,
  (...args): void => {
    new UserController().getUser(...args);
  },
);

//decide from where we need to get userId(token/params): currently fetching userId from token
userRoute.delete<PathParams, ResponseBody<DeleteUserResponse>, RequestBody, QueryParams>(
  '/:userId',
  checkToken,
  (...args): void => {
    new UserController().deleteUser(...args);
  },
);

module.exports = { router: userRoute, basePath: API_ROUTES.USERS };
