import Joi from 'joi';

import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import { MESSAGE_VALIDATION } from '@src/constants';
import EmptyObject from '@src/types/request/emptyObject';
import { CreateRoleRequest } from '@src/types/request/roleRequest';

export = {
  AddRoleRequest: joiValidationRequest<EmptyObject, CreateRoleRequest, EmptyObject, EmptyObject>({
    body: {
      name: Joi.string().required().description(MESSAGE_VALIDATION.ROLE),
      description: Joi.string().required().description(MESSAGE_VALIDATION.ROLE_DESCRIPTION),
    },
  }),
};
