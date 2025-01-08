import Joi from 'joi';

import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';
import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import { MESSAGE_VALIDATION } from '@src/constants';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';

export = {
  RegisterRequest: joiValidationRequest<
    EmptyObjectRequest,
    UserRegisterRequest,
    EmptyObjectRequest,
    EmptyObjectRequest
  >({
    body: {
      firstName: Joi.string().required().description(MESSAGE_VALIDATION.FIST_NAME),
      lastName: Joi.string().required().description(MESSAGE_VALIDATION.LAST_NAME),
      email: Joi.string().required().email().description(MESSAGE_VALIDATION.EMAIL),
      password: Joi.string().required().description(MESSAGE_VALIDATION.PASSWORD),
    },
  }),

  LoginRequest: joiValidationRequest<EmptyObjectRequest, UserLoginRequest, EmptyObjectRequest, EmptyObjectRequest>({
    body: {
      email: Joi.string().required().email().description(MESSAGE_VALIDATION.EMAIL),
      password: Joi.string().required().description(MESSAGE_VALIDATION.PASSWORD),
    },
  }),
};
