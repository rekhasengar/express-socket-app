import { Router } from 'express';

import { API_ROUTE } from '@src/constants';
import { PathParams, QueryParams, RequestBody, ResponseBody } from '@src/shared/types/customExpressRequest';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';
import MessageController from '@src/controllers/v1/messageController';
import { MessageResponse } from '@src/types/response/messageResponse';

const messageRoute = Router();
const messageController = new MessageController();

messageRoute.get<
  PathParams<MessagePathRequest>,
  ResponseBody<MessageResponse>,
  RequestBody,
  QueryParams<MessageQueryRequest>
>('/:conversationId', (...args): void => {
  messageController.getUserMessage(...args);
});

module.exports = { router: messageRoute, basePath: API_ROUTE.MESSAGES };
