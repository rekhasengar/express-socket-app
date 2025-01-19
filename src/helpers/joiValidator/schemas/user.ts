import Joi from 'joi';

import { joiValidationRequest } from '..';
import { JOI_VALIDATION_MESSAGE } from '@src/constants';
import { UserUpdateRequest } from '@src/types/request/userRequest';
import EmptyObject from '@src/types/request/emptyObject';

export = {
  UpdateUserRequest: joiValidationRequest<EmptyObject, UserUpdateRequest, EmptyObject, EmptyObject>({
    body: {
      firstName: Joi.string().required().description(JOI_VALIDATION_MESSAGE.FIST_NAME),
      lastName: Joi.string().required().description(JOI_VALIDATION_MESSAGE.LAST_NAME),
      email: Joi.string().required().email().description(JOI_VALIDATION_MESSAGE.EMAIL),
    },
  }),
};
