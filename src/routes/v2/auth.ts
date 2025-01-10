import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import AuthContext from '@src/context/authContext';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { RegisterUserResponse } from '@src/types/response/userResponse';

const authRoute = Router();

authRoute.post<PathParams, RegisterUserResponse, UserRegisterRequest, QueryParams>(
  '/register',
  doValidation(ConversationSchema.RegisterRequest),
  (...args) => {
    AuthContext.getAuthController.registerUser(...args);
  },
);

authRoute.post<PathParams, ResponseBody<RegisterUserResponse>, RequestBody<UserLoginRequest>, QueryParams>(
  '/login',
  doValidation(ConversationSchema.LoginRequest),
  (...args) => {
    AuthContext.getAuthController.userLogin(...args);
  },
);

module.exports = { router: authRoute, basePath: API_ROUTE.AUTH };
