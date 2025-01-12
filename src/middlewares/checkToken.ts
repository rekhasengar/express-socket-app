import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from 'http-status-codes';

import { getMessage } from '@src/config/messages';
import { UNAUTHORIZED_ERROR } from '@src/config/messages/codes';
import RequestContext from '@src/helpers/context';
import ResponseHandler from '@src/helpers/responseHandler';
import { validateJwtToken } from '@src/utils/jwt';
import CustomRequest from '@src/shared/types/customExpressRequest';
import CustomError from '@src/shared/errorHandler/customError';
import { AUTH_MESSAGES } from '@src/constants/messages';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const responseHandler = new ResponseHandler(req, res);
  const { context, locale } = req;
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return _formErrorMessage(responseHandler, context, locale);
    }
    const token = bearerToken.split('Bearer')[1].trim();
    const payload = validateJwtToken(token);
    if (payload === null) {
      return _formErrorMessage(responseHandler, context, locale);
    }
    const id = payload.id;
    // const user = await new UserRepository().findUser({ id: id as unknown as number }, ['id']);
    // if (!user) {
    //   return _formErrorMessage(responseHandler, context, locale);
    // }
    req.app.locals.userId = id;
    return next();
  } catch (error) {
    return responseHandler.handleError(locale, error as Error);
  }
}

export async function checkToken2(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_MISSING);
    }
    const token = bearerToken.split('Bearer')[1].trim();
    const payload = validateJwtToken(token);
    if (payload === null) {
      throw new CustomError(HttpStatusCode.UNAUTHORIZED, AUTH_MESSAGES.TOKEN_INVALID);
    }
    req.app.locals.userId = payload.id;
    return next();
  } catch (error) {
    throw new CustomError(HttpStatusCode.BAD_REQUEST, AUTH_MESSAGES.TOKEN_INVALID);
  }
}

function _formErrorMessage(responseHandler: ResponseHandler, context: RequestContext, locale: string) {
  const code = UNAUTHORIZED_ERROR;
  context.logError({
    message: getMessage(code),
    action: code,
    source: 'middleware#checkToken',
  });
  const message = getMessage(code, locale);
  return responseHandler.unauthorizedError(message, code);
}
