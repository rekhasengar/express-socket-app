import { ErrorItem } from '../types/apiErrorRequestType';

export class ApiErrorResponseBody {
  statusCode?: number;
  message?: string;
  errors?: Array<ErrorItem>;

  constructor(statusCode?: number, message?: string, errors?: Array<ErrorItem>) {
    if (statusCode) {
      this.statusCode = statusCode;
    }

    if (message) {
      this.message = message;
    }

    if (errors) {
      this.errors = errors;
    }
  }
}
