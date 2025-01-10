import HttpStatus from 'http-status-codes';

import { ErrorResponseBody } from './apiErrorResponseBody';
import { INTERNAL_SERVER_ERROR } from '@src/config/messages/codes';
import EmptyObject from '@src/types/request/emptyObject';

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
