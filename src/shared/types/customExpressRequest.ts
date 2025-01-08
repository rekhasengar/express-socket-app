import { RequestHandler, Request } from 'express';

import { ApiResponse } from '../errorHandler/apiResponse';
import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';

export type ICustomRequest<Path, ResBody, ReqBody, Query> = Request<Path, ResBody, ReqBody, Query>;
export type PathParams<T = EmptyObjectRequest> = EmptyObjectRequest & T;
export type ResponseBody<T = EmptyObjectRequest> = ApiResponse<T | EmptyObjectRequest>;
export type RequestBody<T = EmptyObjectRequest> = EmptyObjectRequest & T;
export type QueryParams<T = EmptyObjectRequest> = EmptyObjectRequest & T;

export type CustomRequestHandler<
  Path = EmptyObjectRequest,
  ResBody = EmptyObjectRequest,
  ReqBody = EmptyObjectRequest,
  Query = EmptyObjectRequest,
> = RequestHandler<Path, ApiResponse<ResBody>, ReqBody, Query>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface CustomRequest<
  Path = EmptyObjectRequest,
  ResBody = EmptyObjectRequest,
  ReqBody = EmptyObjectRequest,
  Query = EmptyObjectRequest,
> extends Request<Path, ApiResponse<ResBody>, ReqBody, Query> {}
