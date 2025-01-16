import RequestContext from '@src/helpers/context';
import { UserLoginRequest, UserLogoutPathRequest, UserRegisterRequest } from '@src/types/request/userRequest';

export class UserLoginDto {
  email: string;
  password: string;
  context: RequestContext;
  locale: string;

  constructor(body: UserLoginRequest, context: RequestContext, locale: string) {
    this.email = body.email.trim();
    this.password = body.password.trim();
    this.context = context;
    this.locale = locale;
  }
}

export class UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  context: RequestContext;
  locale: string;

  constructor(body: UserRegisterRequest, context: RequestContext, locale: string) {
    this.firstName = body.firstName.trim();
    this.lastName = body.lastName.trim();
    this.email = body.email.trim();
    this.password = body.password.trim();
    this.context = context;
    this.locale = locale;
  }
}

export class UserLogoutDto {
  userId: string;
  context: RequestContext;

  constructor(params: UserLogoutPathRequest, context: RequestContext) {
    this.userId = params.userId;
    this.context = context;
  }
}
