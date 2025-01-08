import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import AuthContext from '@src/context/authContext';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { UserResponse } from '@src/types/response/userResponse';

const authRoute = Router();

authRoute.post<PathParams, ResponseBody<UserResponse>, RequestBody<UserRegisterRequest>, QueryParams>(
  '/register',
  doValidation(ConversationSchema.RegisterRequest),
  (...args) => {
    AuthContext.getAuthController.userRegistration(...args);
  },
);

authRoute.post<PathParams, ResponseBody<UserResponse>, RequestBody<UserLoginRequest>, QueryParams>(
  '/login',
  doValidation(ConversationSchema.LoginRequest),
  (...args) => {
    AuthContext.getAuthController.userLogin(...args);
  },
);

module.exports = { router: authRoute, basePath: API_ROUTE.AUTH };
