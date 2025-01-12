import { UserLoginRequest, UserLogoutPathRequest, UserRegisterRequest } from '@src/types/request/userRequest';

export class UserLoginDto {
  email: string;
  password: string;
  constructor(body: UserLoginRequest) {
    this.email = body.email.trim();
    this.password = body.password.trim();
  }
}

export class UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(body: UserRegisterRequest) {
    this.firstName = body.firstName.trim();
    this.lastName = body.lastName.trim();
    this.email = body.email.trim();
    this.password = body.password.trim();
  }
}

export class UserLogoutDto {
  userId: string;

  constructor(params: UserLogoutPathRequest) {
    this.userId = params.userId;
  }
}
