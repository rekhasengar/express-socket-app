import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import EmptyObjectRequest from '@src/types/request/emptyObjectRequest';
import { ConversationResponse } from '@src/types/response/conversationResponse';
import { CONTROLLER_MESSAGE } from '@src/constants';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationService from '@service/v2/conversationService';

export default class ConversationController {
  private readonly _conversationService: ConversationService;

  constructor(conversationService: ConversationService) {
    this._conversationService = conversationService;
  }

  public async getAllActiveUser(
    req: CustomRequest<EmptyObjectRequest, ConversationResponse, EmptyObjectRequest, EmptyObjectRequest>,
    res: Response<ApiResponse<ConversationResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<ConversationResponse>();

    try {
      const responseFromService = await this._conversationService.getAllActiveUserList();
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
