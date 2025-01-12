import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import AuthContext from '@src/context/authContext';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import AuthSchema from '@src/helpers/joiValidator/schemas/auth';
import { UserLoginRequest, UserLogoutPathRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { AuthResponse } from '@src/types/response/userResponse';

const authRoute = Router();

authRoute.post<PathParams, AuthResponse, UserRegisterRequest, QueryParams>(
  '/register',
  doValidation(AuthSchema.RegisterRequest),
  (...args) => {
    AuthContext.getAuthController.registerUser(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody<UserLoginRequest>, QueryParams>(
  '/login',
  doValidation(AuthSchema.LoginRequest),
  (...args) => {
    AuthContext.getAuthController.userLogin(...args);
  },
);

authRoute.post<PathParams<UserLogoutPathRequest>, ResponseBody<AuthResponse>, RequestBody, QueryParams>(
  '/logout/:userId',
  (...args) => {
    AuthContext.getAuthController.userLogout(...args);
  },
);

module.exports = { router: authRoute, basePath: API_ROUTE.AUTH };
