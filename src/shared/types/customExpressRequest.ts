import { RequestHandler, Request } from 'express';

import { ApiResponse } from '../errorHandler/apiResponse';
import EmptyObject from '@src/types/request/emptyObject';

export type ICustomRequest<Path, ResBody, ReqBody, Query> = Request<Path, ResBody, ReqBody, Query>;
export type PathParams<T = EmptyObject> = EmptyObject & T;
export type ResponseBody<T = EmptyObject> = ApiResponse<T | EmptyObject>;
export type RequestBody<T = EmptyObject> = EmptyObject & T;
export type QueryParams<T = EmptyObject> = EmptyObject & T;

export type CustomRequestHandler<
  Path = EmptyObject,
  ResBody = EmptyObject,
  ReqBody = EmptyObject,
  Query = EmptyObject,
> = RequestHandler<Path, ApiResponse<ResBody>, ReqBody, Query>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface CustomRequest<
  Path = EmptyObject,
  ResBody = EmptyObject,
  ReqBody = EmptyObject,
  Query = EmptyObject,
> extends Request<Path, ApiResponse<ResBody>, ReqBody, Query> {}
