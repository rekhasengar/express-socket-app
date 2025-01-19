import RequestContext from '@src/helpers/context';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
} from '@src/types/request/authRequest';

export class AuthRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  context: RequestContext;

  constructor(authRegisterRequest: AuthRegisterRequest, context: RequestContext) {
    this.firstName = authRegisterRequest.firstName;
    this.lastName = authRegisterRequest.lastName;
    this.email = authRegisterRequest.email;
    this.password = authRegisterRequest.password;
    this.context = context;
  }
}

export class AuthLoginDto {
  email: string;
  password: string;
  context: RequestContext;

  constructor(authLoginRequest: AuthLoginRequest, context: RequestContext) {
    this.email = authLoginRequest.email;
    this.password = authLoginRequest.password;
    this.context = context;
  }
}
export class AuthLogoutDto {
  userId: string;
  context: RequestContext;

  constructor(userId: string, context: RequestContext) {
    this.userId = userId;
    this.context = context;
  }
}

export class AuthForgotPasswordDto {
  userId: string;
  context: RequestContext;

  constructor(userId: string, context: RequestContext) {
    this.userId = userId;
    this.context = context;
  }
}

export class AuthResetPasswordDto {
  token: string;
  newPassword: string;
  context: RequestContext;

  constructor(authResetPasswordRequest: AuthResetPasswordRequest, context: RequestContext) {
    this.token = authResetPasswordRequest.token;
    this.newPassword = authResetPasswordRequest.newPassword;
    this.context = context;
  }
}

export class AuthChangedPasswordDto {
  oldPassword: string;
  newPassword: string;
  userId: string;
  context: RequestContext;

  constructor(authChangePasswordRequest: AuthChangePasswordRequest, userId: string, context: RequestContext) {
    this.oldPassword = authChangePasswordRequest.oldPassword;
    this.newPassword = authChangePasswordRequest.newPassword;
    this.userId = userId;
    this.context = context;
  }
}
