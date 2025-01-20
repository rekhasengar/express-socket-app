import { Router } from 'express';

import { PathParams, ResponseBody, RequestBody, QueryParams } from '@src/shared/types/customExpressRequest';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetSingleUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import UserController from '@src/controllers/v1/userController';
import { API_ROUTES } from '@src/constants';
import { UserUpdateRequest } from '@src/types/request/userRequest';
import { doValidation } from '@src/helpers/joiValidator';
import UserSchema from '../../helpers/joiValidator/schemas/user';
import { checkToken } from '@src/middlewares/checkToken';

const userRoute = Router();
const userController = new UserController();

userRoute.get<PathParams, ResponseBody<GetAllUsersResponse>, RequestBody, QueryParams>('/', (...args): void => {
  userController.getAllRegisterUserList(...args);
});

userRoute.put<PathParams, ResponseBody<UpdateUserResponse>, RequestBody<UserUpdateRequest>, QueryParams>(
  '/',
  checkToken,
  doValidation(UserSchema.UpdateUserRequest),
  (...args): void => {
    userController.updateUserDetails(...args);
  },
);

// decide from where we need to get userId(token/params)
userRoute.get<PathParams, ResponseBody<GetSingleUserResponse>, RequestBody, QueryParams>(
  '/:userId',
  checkToken,
  (...args): void => {
    userController.getUser(...args);
  },
);

//decide from where we need to get userId(token/params)
userRoute.delete<PathParams, ResponseBody<DeleteUserResponse>, RequestBody, QueryParams>(
  '/:userId',
  checkToken,
  (...args): void => {
    userController.deleteUser(...args);
  },
);

module.exports = { router: userRoute, basePath: API_ROUTES.USERS };
