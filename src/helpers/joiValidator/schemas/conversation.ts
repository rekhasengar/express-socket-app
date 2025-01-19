import Joi from 'joi';

import { joiValidationRequest } from '@src/helpers/joiValidator/index';
import EmptyObject from '@src/types/request/emptyObject';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';
import { JOI_VALIDATION_MESSAGE } from '@src/constants';

export = {
  CreateConversationRequest: joiValidationRequest<EmptyObject, CreateConversationRequest, EmptyObject, EmptyObject>({
    body: {
      userIds: Joi.array()
        .items(Joi.string().required())
        .min(1) // At least one userId must be provided
        .required()
        .description(JOI_VALIDATION_MESSAGE.USER_ID),
      groupName: Joi.string().optional().description(JOI_VALIDATION_MESSAGE.GROUP_NAME),
    },
  }),

  DeleteConversationRequest: joiValidationRequest<
    DeleteConversationMessagePathParams,
    EmptyObject,
    EmptyObject,
    EmptyObject
  >({
    path: {
      conversationId: Joi.string().required().description(JOI_VALIDATION_MESSAGE.CONVERSATION_ID),
      messageId: Joi.string().required().description(JOI_VALIDATION_MESSAGE.MESSAGE_ID),
    },
  }),
};
