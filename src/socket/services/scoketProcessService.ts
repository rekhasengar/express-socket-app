import HttpStatusCode from 'http-status-codes';

import UserService from '@service/v2/userService';
import EventEnum from '@src/enums/eventEnum';
import UserRepository from '@src/repositories/v2/userRepository';
import CustomError from '@src/shared/errorHandler/customError';
import { BaseRequest } from '@src/types/request/baseRequest';
import { ERROR_MESSAGES } from '@src/constants';
import ConversationService from '@service/v2/conversationService';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import ConversationMemberService from '@service/v2/conversationMemberService';
import ConversationMemberRepository from '@src/repositories/v2/conversationMemberRepository';
import SocketService from '@service/v2/socketService';
import SocketRepository from '@src/repositories/v2/socketRepository';

export default class SocketProcessService {
  private _userRepository: UserRepository;
  private _userService: UserService;
  private _conversationRepository: ConversationRepository;
  private _conversationService: ConversationService;
  private _conversationMemberRepository: ConversationMemberRepository;
  private _conversationMemberService: ConversationMemberService;
  private _socketRepository: SocketRepository;
  private _socketService: SocketService;

  constructor() {
    this._userRepository = new UserRepository();
    this._userService = new UserService(this._userRepository);
    this._conversationRepository = new ConversationRepository();
    this._conversationService = new ConversationService(
      this._userService,
      this._conversationRepository,
      this._conversationMemberService,
    );
    this._conversationMemberRepository = new ConversationMemberRepository();
    this._conversationMemberService = new ConversationMemberService(this._conversationMemberRepository);
    this._socketRepository = new SocketRepository();
    this._socketService = new SocketService(this._socketRepository);
  }
  public async processMessage(data: BaseRequest): Promise<void> {
    switch (data.eventType) {
      case EventEnum.ADD_USER:
        await this._addUserInGroup(data);
    }
  }

  private async _addUserInGroup(requestData: BaseRequest): Promise<void> {
    const group = await this._conversationService.checkGroupExistsOrNot(requestData.data.conversationId);
    if (!group) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.GROUP_NOT_EXISTS);
    }

    const adminUser = await this._userService.getUserById(requestData.data.adminId);
    if (!adminUser) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }

    const user = await this._userService.getUserById(requestData.data.userId);
    if (!user) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.USER_NOT_EXISTS);
    }
    const userConversation = await this._conversationMemberService.checkUserAlreadyExistsInConversation(
      requestData.data.userId,
      requestData.data.conversationId,
    );

    if (userConversation) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_ALREADY_EXIST_IN_CONVERSATION);
    }
    // await this._conversationMemberService.addUserInConversation(
    //   requestData.data.userId,
    //   requestData.data.conversationId,
    //   requestData.data.roleId,
    // );

    await this._socketService.getSocketIdsByConversationId(requestData.data.conversationId);

    // for (let i = 0; i <= socketData.length; i++) {
    //   const socket = socketData[i];
    //   if (socket.socketId) {
    //     emitSocketEvent(socket.socketId, socket.userKey, EventEnum.ADD_USER, { message: 'User added' });
    //   }
    // }
  }
}
