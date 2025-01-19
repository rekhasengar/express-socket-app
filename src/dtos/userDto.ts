import RequestContext from '@src/helpers/context';
import { UserUpdateRequest } from '@src/types/request/userRequest';

export class UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  context: RequestContext;

  constructor(userId: string, userUpdateRequest: UserUpdateRequest, context: RequestContext) {
    this.userId = userId;
    this.firstName = userUpdateRequest.firstName;
    this.lastName = userUpdateRequest.lastName;
    this.email = userUpdateRequest.email;
    this.context = context;
  }
}

export class GetUserDto {
  userId: string;
  context: RequestContext;

  constructor(userId: string, context: RequestContext) {
    this.userId = userId;
    this.context = context;
  }
}

export class DeleteUserDto {
  userId: string;
  context: RequestContext;

  constructor(userId: string, context: RequestContext) {
    this.userId = userId;
    this.context = context;
  }
}
