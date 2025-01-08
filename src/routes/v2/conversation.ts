import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import ConversationContext from '@src/context/conversationContext';
import { ConversationResponse } from '@src/types/response/conversationResponse';

const conversationRoute = Router();

conversationRoute.post<PathParams, ResponseBody<ConversationResponse>, RequestBody, QueryParams>(
  '/current-users',
  (...args): void => {
    ConversationContext.getConversationController.getAllActiveUser(...args);
  },
);

module.exports = { router: conversationRoute, basePath: API_ROUTE.CONVERSATION };
