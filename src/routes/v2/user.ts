import { Router } from 'express';

import { PathParams, ResponseBody, RequestBody, QueryParams } from '@src/shared/types/customExpressRequest';
import { GetActiveUsersResponse, GetUserStatusResponse } from '@src/types/response/userResponse';
import UserController from '@src/controllers/v2/userController';
import { API_ROUTE } from '@src/constants';

const userRoute = Router();

userRoute.get<PathParams, ResponseBody<GetActiveUsersResponse>, RequestBody, QueryParams>(
  '/current-users',
  (...args): void => {
    new UserController().getAllActiveUser(...args);
  },
);

userRoute.get<PathParams, ResponseBody<GetUserStatusResponse>, RequestBody, QueryParams>('/status', (...args): void => {
  new UserController().getAllUserStatus(...args);
});

module.exports = { router: userRoute, basePath: API_ROUTE.USERS };
