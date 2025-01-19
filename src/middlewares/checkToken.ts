import { NextFunction, Response } from 'express';
import HttpStatusCode from 'http-status-codes';
import { validateJwtToken } from '@src/utils/jwt';
import CustomRequest from '@src/shared/types/customExpressRequest';
import CustomError from '@src/shared/errorHandler/customError';
import { AUTH_MESSAGES } from '@src/constants/messages';

export async function checkToken(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
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
