import Joi from 'joi';

import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';

type JoiRequest<T> = {
  [key in keyof T]: JoiType<T[key]>;
};

type JoiType<Type> = Type extends string
  ? Joi.StringSchema | Joi.NumberSchema
  : Type extends number
  ? Joi.NumberSchema
  : Type extends boolean
  ? Joi.BooleanSchema
  : Type extends Array<unknown>
  ? Joi.ArraySchema
  : // eslint-disable-next-line @typescript-eslint/ban-types
  Type extends object
  ? Joi.ObjectSchema<Type>
  : never;

export type JoiRequestModelInternal<ReqBody, QueryParams, PathParams, Headers> = {
  path: PathParams extends EmptyObjectRequest ? EmptyObjectRequest : JoiRequest<PathParams>;
  body: ReqBody extends EmptyObjectRequest ? EmptyObjectRequest : JoiRequest<ReqBody>;
  query: QueryParams extends EmptyObjectRequest ? EmptyObjectRequest : JoiRequest<QueryParams>;
  header: Headers extends EmptyObjectRequest ? EmptyObjectRequest : JoiRequest<Headers>;
  model: string;
  group: string;
  description: string;
};

export type JoiRequestModel<
  ReqBody = EmptyObjectRequest,
  QueryParams = EmptyObjectRequest,
  PathParams = EmptyObjectRequest,
  Headers = EmptyObjectRequest,
> = Pick<
  JoiRequestModelInternal<ReqBody, QueryParams, PathParams, Headers>,
  | (PathParams extends EmptyObjectRequest ? never : 'path')
  | (QueryParams extends EmptyObjectRequest ? never : 'query')
  | (ReqBody extends EmptyObjectRequest ? never : 'body')
  | (Headers extends EmptyObjectRequest ? never : 'header')
>;
