import HttpStatus from 'http-status-codes';

import { INTERNAL_SERVER_ERROR } from '@src/config/messages/codes';
import EmptyObject from '@src/types/request/emptyObject';
import ErrorResponseBody from '../types/errorResponseBody';

export class ApiResponse<T = EmptyObject> {
  public status: number = HttpStatus.BAD_REQUEST;
  public message = '';
  public body: T = <T>{};

  public getDefaultErrorResponse(): ApiResponse<ErrorResponseBody> {
    const errorResponse = new ApiResponse<ErrorResponseBody>();
    errorResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    errorResponse.message = INTERNAL_SERVER_ERROR;
    errorResponse.body = {
      errors: [{ messages: [INTERNAL_SERVER_ERROR] }],
    };
    return errorResponse;
  }
}
