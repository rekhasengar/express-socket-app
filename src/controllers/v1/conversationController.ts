import { Response, NextFunction } from 'express';
import HttpStatusCode from 'http-status-codes';

import { ApiResponse } from '@src/shared/errorHandler/apiResponse';
import CustomRequest from '@src/shared/types/customExpressRequest';
import {
  CreateConversationResponse,
  GetConversationMessagesResponse,
  GetConversationResponse,
  GetConversationsResponse,
} from '@src/types/response/conversationResponse';
import { CONTROLLER_MESSAGE } from '@src/constants/messages';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationService from '@service/v1/conversationService';
import { CreateConversationRequest, GetConversationPathParams } from '@src/types/request/conversationRequest';
import { CreateConversationDto, GetConversationDto, GetConversationMessageDto } from '@src/dtos/conversationDto';
import EmptyObject from '@src/types/request/emptyObject';
import { MessagePathRequest, MessageQueryRequest } from '@src/types/request/messageRequest';
import MessageDto from '@src/dtos/messageDto';
import MessageService from '@service/v1/messageService';

export default class ConversationController {
  private readonly _conversationService: ConversationService;
  private readonly _messageService: MessageService;

  constructor() {
    this._conversationService = new ConversationService();
    this._messageService = new MessageService();
  }

  public async createNewConversation(
    req: CustomRequest<EmptyObject, CreateConversationResponse, CreateConversationRequest, EmptyObject>,
    res: Response<ApiResponse<CreateConversationResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<CreateConversationResponse> = new ApiResponse<CreateConversationResponse>();

    try {
      const createConversationDto: CreateConversationDto = new CreateConversationDto(
        req.body,
        req.app.locals.userId,
        req.context,
      );
      const responseFromService: CreateConversationResponse =
        await this._conversationService.createNewConversation(createConversationDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getAllConversationsByUserId(
    req: CustomRequest<EmptyObject, GetConversationsResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetConversationsResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<GetConversationsResponse> = new ApiResponse<GetConversationsResponse>();

    try {
      const getConversationMessageDto: GetConversationMessageDto = new GetConversationMessageDto(
        req.app.locals.userId,
        req.context,
        req.locale,
      );
      const responseFromService: GetConversationsResponse =
        await this._conversationService.getAllConversationsByUserId(getConversationMessageDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getUserMessagesByConversationId(
    req: CustomRequest<MessagePathRequest, GetConversationMessagesResponse, EmptyObject, MessageQueryRequest>,
    res: Response<ApiResponse<GetConversationMessagesResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<GetConversationMessagesResponse> = new ApiResponse<GetConversationMessagesResponse>();
    try {
      const messageDto: MessageDto = new MessageDto(req.params, req.query, req.context);
      const responseFromService: GetConversationMessagesResponse =
        await this._messageService.getUserMessagesByConversationId(messageDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }

  public async getConversationByConversationId(
    req: CustomRequest<GetConversationPathParams, GetConversationResponse, EmptyObject, EmptyObject>,
    res: Response<ApiResponse<GetConversationResponse>>,
    next: NextFunction,
  ): Promise<void> {
    const response: ApiResponse<GetConversationResponse> = new ApiResponse<GetConversationResponse>();
    try {
      const getConversationDto: GetConversationDto = new GetConversationDto(
        req.params,
        req.app.locals.userId,
        req.context,
        req.locale,
      );
      const responseFromService: GetConversationResponse =
        await this._conversationService.getConversation(getConversationDto);
      response.status = HttpStatusCode.OK;
      response.message = CONTROLLER_MESSAGE.SUCCESS;
      response.body = responseFromService;
      res.status(response.status).send(response);
    } catch (error) {
      const customError: CustomError = CustomError.getCustomErrorObject(error);
      return next(customError);
    }
  }
}
