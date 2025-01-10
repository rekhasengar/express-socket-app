import Joi from 'joi';

import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import { MESSAGE_VALIDATION } from '@src/constants';
import { UserLoginRequest, UserRegisterRequest } from '@src/types/request/userRequest';
import EmptyObject from '@src/types/request/emptyObject';

export = {
  RegisterRequest: joiValidationRequest<EmptyObject, UserRegisterRequest, EmptyObject, EmptyObject>({
    body: {
      firstname: Joi.string().required().description(MESSAGE_VALIDATION.FIST_NAME),
      lastname: Joi.string().required().description(MESSAGE_VALIDATION.LAST_NAME),
      email: Joi.string().required().email().description(MESSAGE_VALIDATION.EMAIL),
      password: Joi.string().required().description(MESSAGE_VALIDATION.PASSWORD),
    },
  }),

  LoginRequest: joiValidationRequest<EmptyObject, UserLoginRequest, EmptyObject, EmptyObject>({
    body: {
      email: Joi.string().required().email().description(MESSAGE_VALIDATION.EMAIL),
      password: Joi.string().required().description(MESSAGE_VALIDATION.PASSWORD),
    },
  }),
};
