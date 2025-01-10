import EmptyObject from '@src/types/request/emptyObject';
import Joi from 'joi';

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
  path: PathParams extends EmptyObject ? EmptyObject : JoiRequest<PathParams>;
  body: ReqBody extends EmptyObject ? EmptyObject : JoiRequest<ReqBody>;
  query: QueryParams extends EmptyObject ? EmptyObject : JoiRequest<QueryParams>;
  header: Headers extends EmptyObject ? EmptyObject : JoiRequest<Headers>;
  model: string;
  group: string;
  description: string;
};

export type JoiRequestModel<
  ReqBody = EmptyObject,
  QueryParams = EmptyObject,
  PathParams = EmptyObject,
  Headers = EmptyObject,
> = Pick<
  JoiRequestModelInternal<ReqBody, QueryParams, PathParams, Headers>,
  | (PathParams extends EmptyObject ? never : 'path')
  | (QueryParams extends EmptyObject ? never : 'query')
  | (ReqBody extends EmptyObject ? never : 'body')
  | (Headers extends EmptyObject ? never : 'header')
>;
