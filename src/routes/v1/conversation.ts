import { Router } from 'express';

import { API_ROUTES } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import {
  CreateConversationResponse,
  GetConversationMessagesResponse,
  GetConversationResponse,
  GetConversationsResponse,
} from '@src/types/response/conversationResponse';
import { CreateConversationRequest, GetConversationPathParams } from '@src/types/request/conversationRequest';
import { checkToken } from '@src/middlewares/checkToken';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { doValidation } from '@src/helpers/joiValidator';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';
import ConversationController from '@src/controllers/v1/conversationController';

const conversationRoute = Router();

conversationRoute.post<
  PathParams,
  ResponseBody<CreateConversationResponse>,
  RequestBody<CreateConversationRequest>,
  QueryParams
>('/', checkToken, doValidation(ConversationSchema.CreateConversationRequest), (...args): void => {
  new ConversationController().createNewConversation(...args);
});

conversationRoute.get<PathParams, ResponseBody<GetConversationsResponse>, RequestBody, QueryParams>(
  '/',
  checkToken,
  (...args): void => {
    new ConversationController().getAllConversationsByUserId(...args);
  },
);

conversationRoute.get<
  PathParams<MessagePathRequest>,
  ResponseBody<GetConversationMessagesResponse>,
  RequestBody,
  QueryParams<MessageQueryRequest>
>('/:conversationId/messages', (...args): void => {
  new ConversationController().getUserMessagesByConversationId(...args);
});

conversationRoute.get<
  PathParams<GetConversationPathParams>,
  ResponseBody<GetConversationResponse>,
  RequestBody,
  QueryParams
>('/:conversationId', checkToken, (...args): void => {
  new ConversationController().getConversationByConversationId(...args);
});

module.exports = { router: conversationRoute, basePath: API_ROUTES.CONVERSATIONS };
