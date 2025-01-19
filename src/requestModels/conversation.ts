import Joi from 'joi';

export = {
  0: {
    body: {
      userIds: Joi.array().items(Joi.string().required()).required(),
      groupName: Joi.string().optional(),
      isGroupChat: Joi.string().optional(),
    },
    model: 'CreateConversationRequest',
    group: 'Conversation',
    description: 'Create conversation',
  },
  1: {
    path: {
      page: Joi.number().optional(),
      limit: Joi.number().required(),
    },
    query: {
      conversationId: Joi.string().required(),
    },
    model: 'GetConversationRequest',
    group: 'Conversation',
    description: 'Get user message by conversation id',
  },
};
