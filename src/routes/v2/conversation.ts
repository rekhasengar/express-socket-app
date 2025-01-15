import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { ConversationResponse, GetConversationsResponse } from '@src/types/response/conversationResponse';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';
import { checkToken2 } from '@src/middlewares/checkToken';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { doValidation } from '@src/helpers/joiValidator';
import ConversationController from '@src/controllers/v2/conversationController';

const conversationRoute = Router();
const conversationController = new ConversationController();

conversationRoute.post<
  PathParams,
  ResponseBody<ConversationResponse>,
  RequestBody<CreateConversationRequest>,
  QueryParams
>('/create', checkToken2, doValidation(ConversationSchema.CreateConversationRequest), (...args): void => {
  conversationController.createNewConversation(...args);
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
    conversationController.deleteConversationMessage(...args);
  },
);

conversationRoute.get<PathParams, ResponseBody<GetConversationsResponse>, RequestBody, QueryParams>(
  '/',
  checkToken2,
  (...args): void => {
    conversationController.getConversations(...args);
  },
);

module.exports = { router: conversationRoute, basePath: API_ROUTE.CONVERSATIONS };
