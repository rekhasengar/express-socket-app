import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomError from '@src/shared/errorHandler/customError';
import CustomRequest from '@src/shared/types/customExpressRequest';
import EmptyObject from '@src/types/request/emptyObject';
import MessageService from '@service/v2/messageService';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';
import { MessageResponse } from '@src/types/response/messageResponse';
import MessageDto from '@src/dtos/messageDto';

export default class MessageController {
  private readonly _messageService: MessageService;

  constructor() {
    this._messageService = new MessageService();
  }

  public async getMessage(
    req: CustomRequest<MessagePathRequest, MessageResponse, EmptyObject, MessageQueryRequest>,
    res: Response<ApiResponse<MessageResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<MessageResponse>();
    try {
      const messageDto = new MessageDto(req.params, req.query, req.context, req.locale);
      const responseFromService = await this._messageService.getMessagesByConversationId(messageDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }
}
