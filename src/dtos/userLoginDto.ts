import { UserLoginRequest } from '@src/types/request/userRequest';

export default class UserLoginDto {
  email: string;
  password: string;
  constructor(body: UserLoginRequest) {
    this.email = body.email;
    this.password = body.password;
  }
}
