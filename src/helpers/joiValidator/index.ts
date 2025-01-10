import { CustomRequestHandler } from '@src/shared/types/customExpressRequest';
import expressValidation from './validate';
import { JoiRequestModel } from './joiRequest';
import EmptyObject from '@src/types/request/emptyObject';

export function doValidation<ReqBody, QueryParams, PathParams, Headers>(
  params: JoiRequestModel<ReqBody, QueryParams, PathParams, Headers>,
): CustomRequestHandler<PathParams, EmptyObject, ReqBody, QueryParams> {
  return expressValidation(params);
}

export function joiValidationRequest<
  PathParams = EmptyObject,
  ReqBody = EmptyObject,
  QueryParams = EmptyObject,
  Headers = EmptyObject,
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
