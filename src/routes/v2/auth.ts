import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import AuthSchema from '@src/helpers/joiValidator/schemas/auth';
import { UserLoginRequest, UserLogoutPathRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import { AuthResponse } from '@src/types/response/userResponse';
import AuthController from '@src/controllers/v2/authController';

const authRoute = Router();
const authController = new AuthController();

authRoute.post<PathParams, AuthResponse, UserRegisterRequest, QueryParams>(
  '/register',
  doValidation(AuthSchema.RegisterRequest),
  (...args) => {
    authController.registerUser(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody<UserLoginRequest>, QueryParams>(
  '/login',
  doValidation(AuthSchema.LoginRequest),
  (...args) => {
    authController.userLogin(...args);
  },
);

authRoute.post<PathParams<UserLogoutPathRequest>, ResponseBody<AuthResponse>, RequestBody, QueryParams>(
  '/logout/:userId',
  (...args) => {
    authController.userLogout(...args);
  },
);

module.exports = { router: authRoute, basePath: API_ROUTE.AUTH };
