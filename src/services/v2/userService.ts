import HttpStatusCode from 'http-status-codes';

import UserRepository from '@src/repositories/v2/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';
import RequestContext from '@src/helpers/context';
import { ACTION_MESSAGE, LOGS } from '@src/constants';
import { USER_MESSAGES } from '@src/constants/messages';
import { GetActiveUsersResponse, GetUserStatusResponse, UserStatusResponse } from '@src/types/response/userResponse';
import ConversationService from './conversationService';
import UserStatusEnum from '@src/enums/userStatusEnum';
import { SocketModel } from '@src/database/mysql/models/socketModel';
import { getMessage } from '@src/config/messages';
import { CustomErrorHandler } from '@src/helpers/customErrorHandler';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async getUserByUserId(userId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userRepository.getUserByUserId(userId, relations);
  }

  public async updateUserByUserId(userId: string): Promise<void> {
    await this._userRepository.updateUserByUserId(userId);
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this._userRepository.getUserByEmail(email);
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userRepository.createNewUser(user);
  }

  public async saveUser(user: UserModel): Promise<UserModel> {
    return await this._userRepository.saveUser(user);
  }
  public async getAllUser(context: RequestContext): Promise<GetActiveUsersResponse> {
    const users = await this._userRepository.getAllRegisterUserList();
    if (!users) {
      context.logError({
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.getAllUser.name),
        action: ACTION_MESSAGE.GET_ALL_ACTIVE_USER_PROCESS,
        message: USER_MESSAGES.ACTIVE_USERS_NOT_FOUND,
      });
      const message: string = getMessage(USER_MESSAGES.ACTIVE_USERS_NOT_FOUND);
      throw new CustomErrorHandler(HttpStatusCode.NOT_FOUND, message, USER_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }

    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.getAllUser.name),
      action: ACTION_MESSAGE.GET_ALL_ACTIVE_USER_PROCESS,
      message: USER_MESSAGES.GET_ALL_ACTIVE_USERS_LIST,
    });
    return {
      users: users,
    };
  }

  public async getAllUserByUserIds(userIds: Array<string>, relations?: Array<string>): Promise<Array<UserModel>> {
    return await this._userRepository.getAllUserByUserIds(userIds, relations);
  }

  public async getUserConversationsForGetConversationApi(userId: string): Promise<UserModel | null> {
    return await this._userRepository.getUserConversationsForGetConversationApi(userId);
  }

  public async getUserIdBySocketId(socketId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userRepository.getUserIdBySocketId(socketId, relations);
  }

  public async getUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    return await this._userRepository.getUsersByConversationIds(conversationIds, relations);
  }

  public async getAllUserStatus(context: RequestContext): Promise<GetUserStatusResponse> {
    const users: Array<UserModel> = await this._userRepository.getAllUsers(['sockets']);
    if (!users) {
      context.logError({
        source: LOGS.SUCCESS_MESSAGE(UserService.name, this.getAllUserStatus.name),
        action: ACTION_MESSAGE.USER_STATUS_PROCESS,
        message: USER_MESSAGES.ERROR_WHILE_FETCHED_USER_STATUS,
      });
    }

    const sockets: Array<SocketModel> = users
      .map((user: UserModel): SocketModel[] => {
        return user.sockets;
      })
      .flat();

    const activeUsers: Array<SocketModel> = this._getSocketsWithinOneMinute(sockets);

    const userStatusResponse: Set<UserStatusResponse> = new Set<UserStatusResponse>();

    for (const socket of sockets) {
      for (const activeUser of activeUsers) {
        if (socket.id === activeUser.id) {
          userStatusResponse.add({
            userId: socket.userKey,
            status: UserStatusEnum.ONLINE,
          });
        } else {
          userStatusResponse.add({
            userId: socket.userKey,
            status: UserStatusEnum.OFFLINE,
          });
        }
      }
    }
    context.logInfo({
      source: LOGS.SUCCESS_MESSAGE(UserService.name, this.getAllUserStatus.name),
      action: ACTION_MESSAGE.USER_STATUS_PROCESS,
      message: USER_MESSAGES.USER_STATUS_FETCHED_SUCCESSFULLY,
    });

    return {
      status: Array.from(userStatusResponse), // Convert Set to Array
    };
  }

  public async getUserByUserIdAndConversationId(
    userId: string,
    conversationId: string,
    relations?: Array<string>,
  ): Promise<UserModel | null> {
    return await this._userRepository.getUserByUserIdAndConversationId(userId, conversationId, relations);
  }

  private _getSocketsWithinOneMinute(sockets: Array<SocketModel>): Array<SocketModel> {
    const currentDate: Date = new Date();

    return sockets.filter((socket: SocketModel): boolean => {
      const socketCreatedDate: Date = new Date(socket.createAt);
      const timeDifference: number = Math.abs(currentDate.getTime() - socketCreatedDate.getTime());
      const oneMinuteInMilliseconds: number = 60 * 1000;
      return timeDifference <= oneMinuteInMilliseconds;
    });
  }
}
