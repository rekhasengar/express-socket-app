import { CustomRequestHandler } from '@src/shared/types/customExpressRequest';
import expressValidation from './validate';
import { JoiRequestModel } from './joiRequest';
import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';

export function doValidation<ReqBody, QueryParams, PathParams, Headers>(
  params: JoiRequestModel<ReqBody, QueryParams, PathParams, Headers>,
): CustomRequestHandler<PathParams, EmptyObjectRequest, ReqBody, QueryParams> {
  return expressValidation(params);
}

export function joiValidationRequest<
  PathParams = EmptyObjectRequest,
  ReqBody = EmptyObjectRequest,
  QueryParams = EmptyObjectRequest,
  Headers = EmptyObjectRequest,
>(
  schema: JoiRequestModel<ReqBody, QueryParams, PathParams, Headers>,
): JoiRequestModel<ReqBody, QueryParams, PathParams, Headers> {
  return schema;
}

export function joiEnumValidation(e: { [s: string]: string | number }): Array<string | number> {
  return Object.keys(e)
    .filter((value) => isNaN(Number(value)))
    .map((key) => e[key]);
}
