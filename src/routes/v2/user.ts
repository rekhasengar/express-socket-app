import { Router } from 'express';

import { PathParams, ResponseBody, RequestBody, QueryParams } from '@src/shared/types/customExpressRequest';
import { GetActiveUsersResponse, GetUserStatusResponse } from '@src/types/response/userResponse';
import UserController from '@src/controllers/v2/userController';
import { API_ROUTE } from '@src/constants';
import { GetCurrentUsersQueryParamRequest } from '@src/types/request/userRequest';

const userRoute = Router();
const userController = new UserController();

userRoute.get<
  PathParams,
  ResponseBody<GetActiveUsersResponse>,
  RequestBody,
  QueryParams<GetCurrentUsersQueryParamRequest>
>('/current-users', (...args): void => {
  userController.getAllUser(...args);
});

userRoute.get<PathParams, ResponseBody<GetUserStatusResponse>, RequestBody, QueryParams>('/status', (...args): void => {
  userController.getAllUserStatus(...args);
});

module.exports = { router: userRoute, basePath: API_ROUTE.USERS };
