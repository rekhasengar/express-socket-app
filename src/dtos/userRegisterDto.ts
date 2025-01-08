import { UserRegisterRequest } from '@src/types/request/userRequest';

export default class UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  constructor(body: UserRegisterRequest) {
    this.firstName = body.firstName;
    this.lastName = body.lastName;
    this.email = body.email;
    this.password = body.password;
  }
}
