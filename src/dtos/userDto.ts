import { GetCurrentUsersQueryParamRequest } from '@src/types/request/userRequest';

export default class UserDto {
  page: number;
  limit: number;

  constructor(query: GetCurrentUsersQueryParamRequest) {
    this.page = query.page || 1;
    this.limit = query.limit || 10;
  }
}
