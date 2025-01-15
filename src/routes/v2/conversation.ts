import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import ConversationContext from '@src/context/conversationContext';
import { ConversationResponse, GetConversationsResponse } from '@src/types/response/conversationResponse';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';
import { checkToken2 } from '@src/middlewares/checkToken';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { doValidation } from '@src/helpers/joiValidator';

const conversationRoute = Router();

conversationRoute.post<
  PathParams,
  ResponseBody<ConversationResponse>,
  RequestBody<CreateConversationRequest>,
  QueryParams
>('/create', checkToken2, doValidation(ConversationSchema.CreateConversationRequest), (...args): void => {
  ConversationContext.getConversationController.createNewConversation(...args);
});

conversationRoute.delete<
  PathParams<DeleteConversationMessagePathParams>,
  ResponseBody<ConversationResponse>,
  RequestBody,
  QueryParams
>(
  '/:conversationId/messages/:messageId',
  doValidation(ConversationSchema.DeleteConversationRequest),
  (...args): void => {
    ConversationContext.getConversationController.deleteConversationMessage(...args);
  },
);

conversationRoute.get<PathParams, ResponseBody<GetConversationsResponse>, RequestBody, QueryParams>(
  '/',
  checkToken2,
  (...args): void => {
    ConversationContext.getConversationController.getConversations(...args);
  },
);

module.exports = { router: conversationRoute, basePath: API_ROUTE.CONVERSATIONS };
