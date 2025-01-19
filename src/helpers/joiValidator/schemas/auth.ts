import Joi from 'joi';

import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import { JOI_VALIDATION_MESSAGE } from '@src/constants';
import EmptyObject from '@src/types/request/emptyObject';
import {
  AuthChangePasswordRequest,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResetPasswordRequest,
} from '@src/types/request/authRequest';

export = {
  AuthRegisterRequest: joiValidationRequest<EmptyObject, AuthRegisterRequest, EmptyObject, EmptyObject>({
    body: {
      firstName: Joi.string().required().description(JOI_VALIDATION_MESSAGE.FIST_NAME),
      lastName: Joi.string().required().description(JOI_VALIDATION_MESSAGE.LAST_NAME),
      email: Joi.string().required().email().description(JOI_VALIDATION_MESSAGE.EMAIL),
      password: Joi.string().required().description(JOI_VALIDATION_MESSAGE.PASSWORD),
    },
  }),

  AuthLoginRequest: joiValidationRequest<EmptyObject, AuthLoginRequest, EmptyObject, EmptyObject>({
    body: {
      email: Joi.string().required().email().description(JOI_VALIDATION_MESSAGE.EMAIL),
      password: Joi.string().required().description(JOI_VALIDATION_MESSAGE.PASSWORD),
    },
  }),

  AuthResetPasswordRequest: joiValidationRequest<EmptyObject, AuthResetPasswordRequest, EmptyObject, EmptyObject>({
    body: {
      token: Joi.string().required().description(JOI_VALIDATION_MESSAGE.TOKEN),
      newPassword: Joi.string().required().description(JOI_VALIDATION_MESSAGE.NEW_PASSWORD),
    },
  }),

  AuthChangedPasswordRequest: joiValidationRequest<EmptyObject, AuthChangePasswordRequest, EmptyObject, EmptyObject>({
    body: {
      oldPassword: Joi.string().required().description(JOI_VALIDATION_MESSAGE.OLD_PASSWORD),
      newPassword: Joi.string().required().description(JOI_VALIDATION_MESSAGE.NEW_PASSWORD),
    },
  }),
};
