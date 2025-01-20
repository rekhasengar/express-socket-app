import { ErrorItem } from '@src/shared/types/apiErrorRequestType';

type ErrorResponseBody = {
  errors: Array<ErrorItem>;
};

export default ErrorResponseBody;
