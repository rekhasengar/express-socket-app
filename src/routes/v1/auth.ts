import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import AuthSchema from '@src/helpers/joiValidator/schemas/auth';
import AuthController from '@src/controllers/v1/authController';
import { checkToken } from '@src/middlewares/checkToken';
import { AuthResponse } from '@src/types/response/authResponse';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
} from '@src/types/request/authRequest';

const authRoute = Router();
const authController = new AuthController();

authRoute.post<PathParams, AuthResponse, AuthRegisterRequest, QueryParams>(
  '/register',
  doValidation(AuthSchema.AuthRegisterRequest),
  (...args) => {
    authController.authRegister(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody<AuthLoginRequest>, QueryParams>(
  '/login',
  doValidation(AuthSchema.AuthLoginRequest),
  (...args) => {
    authController.authLogin(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody, QueryParams>('/logout', (...args) => {
  authController.authLogout(...args);
});

//refactor-apis
authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody, QueryParams>('/password-forgot', (...args) => {
  authController.authForgotPassword(...args);
});

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody<AuthResetPasswordRequest>, QueryParams>(
  '/password-reset',
  (...args) => {
    authController.authResetPassword(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResponse>, RequestBody<AuthChangePasswordRequest>, QueryParams>(
  '/password-change',
  checkToken,
  (...args) => {
    authController.authChangePassword(...args);
  },
);

module.exports = { router: authRoute, basePath: API_ROUTE.AUTH };
