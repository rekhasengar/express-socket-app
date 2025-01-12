import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import ConversationContext from '@src/context/conversationContext';
import { ConversationResponse, GetActiveUsersResponse } from '@src/types/response/conversationResponse';
import { CreateConversationRequest, DeleteSingleConversationRequest } from '@src/types/request/conversationRequest';

const conversationRoute = Router();

conversationRoute.get<PathParams, ResponseBody<GetActiveUsersResponse>, RequestBody, QueryParams>(
  '/current-users',
  (...args): void => {
    ConversationContext.getConversationController.getAllActiveUser(...args);
  },
);

conversationRoute.post<
  PathParams,
  ResponseBody<ConversationResponse>,
  RequestBody<CreateConversationRequest>,
  QueryParams
>('/', (...args): void => {
  ConversationContext.getConversationController.createNewConversation(...args);
});

conversationRoute.delete<
  PathParams,
  ResponseBody<ConversationResponse>,
  RequestBody<DeleteSingleConversationRequest>,
  QueryParams
>('/single-message', (...args): void => {
  ConversationContext.getConversationController.deleteSingleConversation(...args);
});

module.exports = { router: conversationRoute, basePath: API_ROUTE.CONVERSATIONS };
