import HttpStatusCode from 'http-status-codes';

import UserRepository from '@src/repositories/v2/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';
import RequestContext from '@src/helpers/context';
import { LOGS, LOGS_ACTIONS } from '@src/constants';
import { USER_MESSAGES } from '@src/constants/messages';
import CustomError from '@src/shared/errorHandler/customError';
import { GetActiveUsersResponse, GetUserStatusResponse, UserStatusResponse } from '@src/types/response/userResponse';
import ConversationService from './conversationService';
import UserStatusEnum from '@src/enums/userStatusEnum';
import { SocketModel } from '@src/database/mysql/models/socketModel';
import UserDto from '@src/dtos/userDto';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async getUserByUserId(userId: string, relations?: string[]): Promise<UserModel | null> {
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
  public async getAllActiveUserList(context: RequestContext, userDto: UserDto): Promise<GetActiveUsersResponse> {
    const users = await this._userRepository.getCurrentActiveAllUsers(userDto.page, userDto.limit);
    if (!users) {
      context.logError({
        message: USER_MESSAGES.ACTIVE_USERS_NOT_FOUND,
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.getAllActiveUserList.name),
        action: LOGS_ACTIONS.CONVERSATION,
      });
      throw new CustomError(HttpStatusCode.NOT_FOUND, USER_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }
    context.logInfo({
      message: USER_MESSAGES.GET_ALL_ACTIVE_USERS_LIST,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.getAllActiveUserList.name),
      action: LOGS_ACTIONS.CONVERSATION,
    });
    return {
      users: users,
    };
  }

  public async getAllUserByUserIds(userIds: Array<string>, relations?: string[]): Promise<Array<UserModel>> {
    return await this._userRepository.getAllUserByUserIds(userIds, relations);
  }

  public async getUserConversationsForGetConversationApi(userId: string): Promise<UserModel | null> {
    return await this._userRepository.getUserConversationsForGetConversationApi(userId);
  }

  public async getUserIdBySocketId(socketId: string, relations?: string[]): Promise<UserModel | null> {
    return await this._userRepository.getUserIdBySocketId(socketId, relations);
  }

  public async getUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: string[],
  ): Promise<Array<UserModel>> {
    return await this._userRepository.getUsersByConversationIds(conversationIds, relations);
  }

  public async getAllUserStatus(context: RequestContext): Promise<GetUserStatusResponse> {
    const users = await this._userRepository.getAllUsers(['sockets']);

    const sockets = users
      .map((user: UserModel): SocketModel[] => {
        return user.sockets;
      })
      .flat();

    const activeUsers = this._getSocketsWithinOneMinute(sockets);

    const userStatusResponse = new Set<UserStatusResponse>();

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
      source: `${UserService.name} #${this.getAllUserStatus.name}`,
      action: 'GetUserStatus',
      message: 'User status get successfully.',
    });

    return {
      status: Array.from(userStatusResponse), // Convert Set to Array
    };
  }

  private _getSocketsWithinOneMinute(sockets: SocketModel[]): SocketModel[] {
    const currentDate = new Date();

    return sockets.filter((socket: SocketModel): boolean => {
      const socketCreatedDate = new Date(socket.createAt);
      const timeDifference = Math.abs(currentDate.getTime() - socketCreatedDate.getTime());
      const oneMinuteInMilliseconds = 60 * 1000;
      return timeDifference <= oneMinuteInMilliseconds;
    });
  }
}
