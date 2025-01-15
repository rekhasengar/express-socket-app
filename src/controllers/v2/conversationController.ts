import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import { ConversationResponse, GetConversationsResponse } from '@src/types/response/conversationResponse';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationService from '@service/v2/conversationService';
import { CreateConversationRequest, DeleteConversationMessagePathParams } from '@src/types/request/conversationRequest';
import { CreateConversationDto, DeleteConversationMessageDto } from '@src/dtos/conversationDto';
import EmptyObject from '@src/types/request/emptyObject';

export default class ConversationController {
  private readonly _conversationService: ConversationService;

  constructor(conversationService: ConversationService) {
    this._conversationService = conversationService;
  }

  public async createNewConversation(
    req: CustomRequest<EmptyObject, ConversationResponse, CreateConversationRequest, EmptyObject>,
    res: Response<ApiResponse<ConversationResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<ConversationResponse>();
    const { context } = req;

    try {
      const createConversationDto = new CreateConversationDto(req.body, req.app.locals.userId);
      const responseFromService = await this._conversationService.createNewConversation(createConversationDto, context);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async deleteConversationMessage(
    req: CustomRequest<DeleteConversationMessagePathParams, ConversationResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<ConversationResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<ConversationResponse>();
    const { userId } = req.app.locals.userId;
    const { context } = req;

    try {
      const deleteConversationDto = new DeleteConversationMessageDto(req.params, userId);
      const responseFromService = await this._conversationService.deleteConversationMessage(
        deleteConversationDto,
        context,
      );
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getConversations(
    req: CustomRequest<EmptyObject, GetConversationsResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetConversationsResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response = new ApiResponse<GetConversationsResponse>();
    const userId = req.app.locals.userId;
    const { context } = req;

    try {
      const responseFromService = await this._conversationService.getConversations(userId, context);
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
