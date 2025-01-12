import Joi from 'joi';

import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import EmptyObject from '@src/types/request/emptyObject';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';
import { MESSAGE_VALIDATION } from '@src/constants';

export = {
  CreateConversationRequest: joiValidationRequest<EmptyObject, CreateConversationRequest, EmptyObject, EmptyObject>({
    body: {
      userId: Joi.array()
        .items(Joi.string().required())
        .min(1) // At least one userId must be provided
        .required()
        .description(MESSAGE_VALIDATION.USER_ID),
      groupName: Joi.string().required().description(MESSAGE_VALIDATION.GROUP_NAME),
    },
  }),

  DeleteConversationRequest: joiValidationRequest<
    DeleteConversationMessagePathParams,
    EmptyObject,
    EmptyObject,
    EmptyObject
  >({
    path: {
      conversationId: Joi.string().required().description(MESSAGE_VALIDATION.CONVERSATION_ID),
      messageId: Joi.string().required().description(MESSAGE_VALIDATION.MESSAGE_ID),
    },
  }),
};
