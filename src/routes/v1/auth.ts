import { Router } from 'express';

import { API_ROUTES } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { doValidation } from '@src/helpers/joiValidator';
import AuthSchema from '@src/helpers/joiValidator/schemas/auth';
import { checkToken } from '@src/middlewares/checkToken';
import {
  AuthChangePasswordResponse,
  AuthForgotPasswordResponse,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthRegisterResponse,
  AuthResetPasswordResponse,
} from '@src/types/response/authResponse';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
} from '@src/types/request/authRequest';
import AuthController from '@src/controllers/v1/authController';

const authRoute = Router();

authRoute.post<PathParams, AuthRegisterResponse, AuthRegisterRequest, QueryParams>(
  '/register',
  doValidation(AuthSchema.AuthRegisterRequest),
  (...args) => {
    new AuthController().authRegister(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthLoginResponse>, RequestBody<AuthLoginRequest>, QueryParams>(
  '/login',
  doValidation(AuthSchema.AuthLoginRequest),
  (...args) => {
    new AuthController().authLogin(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthLogoutResponse>, RequestBody, QueryParams>(
  '/logout',
  checkToken,
  (...args) => {
    new AuthController().authLogout(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthForgotPasswordResponse>, RequestBody, QueryParams>(
  '/password-forgot',
  checkToken,
  (...args) => {
    new AuthController().authForgotPassword(...args);
  },
);

authRoute.post<PathParams, ResponseBody<AuthResetPasswordResponse>, RequestBody<AuthResetPasswordRequest>, QueryParams>(
  '/password-reset',
  doValidation(AuthSchema.AuthResetPasswordRequest),
  (...args) => {
    new AuthController().authResetPassword(...args);
  },
);

authRoute.post<
  PathParams,
  ResponseBody<AuthChangePasswordResponse>,
  RequestBody<AuthChangePasswordRequest>,
  QueryParams
>('/password-change', checkToken, doValidation(AuthSchema.AuthChangedPasswordRequest), (...args) => {
  new AuthController().authChangePassword(...args);
});

module.exports = { router: authRoute, basePath: API_ROUTES.AUTH };
