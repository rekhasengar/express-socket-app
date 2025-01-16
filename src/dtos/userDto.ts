import RequestContext from '@src/helpers/context';
import { GetCurrentUsersQueryParamRequest } from '@src/types/request/userRequest';

export default class UserDto {
  page: number;
  limit: number;
  context: RequestContext;
  locale: string;

  constructor(query: GetCurrentUsersQueryParamRequest, context: RequestContext, locale: string) {
    this.page = query.page || 1;
    this.limit = query.limit || 10;
    this.context = context;
    this.locale = locale;
  }
}
