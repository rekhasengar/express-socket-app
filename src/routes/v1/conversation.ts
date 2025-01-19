import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import {
  ConversationResponse,
  GetConversationMessageResponse,
  GetConversationsResponse,
} from '@src/types/response/conversationResponse';
import { CreateConversationRequest } from '@src/types/request/conversationRequest';
import { checkToken } from '@src/middlewares/checkToken';
import ConversationSchema from '@src/helpers/joiValidator/schemas/conversation';
import { doValidation } from '@src/helpers/joiValidator';
import ConversationController from '@src/controllers/v1/conversationController';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';
import conversationRequestModel from '../../requestModels/conversation';
import { validation } from '@src/privateLibs/swagger-generator-express';

const conversationRoute = Router();
const conversationController = new ConversationController();

conversationRoute.post<
  PathParams,
  ResponseBody<ConversationResponse>,
  RequestBody<CreateConversationRequest>,
  QueryParams
>(
  '/create',
  checkToken,
  validation(conversationRequestModel[0]),
  doValidation(ConversationSchema.CreateConversationRequest),
  (...args): void => {
    conversationController.createNewConversation(...args);
  },
);

conversationRoute.get<PathParams, ResponseBody<GetConversationsResponse>, RequestBody, QueryParams>(
  '/',
  checkToken,
  (...args): void => {
    conversationController.getConversations(...args);
  },
);

conversationRoute.get<
  PathParams<MessagePathRequest>,
  ResponseBody<GetConversationMessageResponse>,
  RequestBody,
  QueryParams<MessageQueryRequest>
>('/:conversationId', validation(conversationRequestModel[1]), (...args): void => {
  conversationController.getUserMessages(...args);
});

module.exports = { router: conversationRoute, basePath: API_ROUTE.CONVERSATIONS };
