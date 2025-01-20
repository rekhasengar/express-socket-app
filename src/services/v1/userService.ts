import UserRepository from '@src/repositories/v1/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';
import RequestContext from '@src/helpers/context';
import { LOGS } from '@src/constants';
import { USER_MESSAGES } from '@src/constants/messages';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetSingleUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import ConversationService from './conversationService';
import CustomError from '@src/shared/errorHandler/customError';
import { DeleteUserDto, GetUserDto, UpdateUserDto } from '@src/dtos/userDto';
import LocalCache from '@src/helpers/localCache';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async getUserByUserId(userId: string, relations?: Array<string>): Promise<UserModel | null> {
    const canUseLocalCache = !relations || !relations.length;
    if (canUseLocalCache) {
      const localCache = LocalCache.get<UserModel>(userId);
      if (localCache) return localCache;
    }
    const dbUser: UserModel | null = await this._userRepository.getUserByUserId(userId, relations);
    if (canUseLocalCache && dbUser) {
      LocalCache.set<UserModel>(userId, dbUser, 300);
    }
    return dbUser;
  }

  public async updateUserByUserId(userId: string, model: Partial<UserModel>): Promise<void> {
    LocalCache.del(userId);
    await this._userRepository.updateUserByUserId(userId, model);
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    const localCache = LocalCache.get<UserModel>(email);
    if (localCache) return localCache;
    const dbUser = await this._userRepository.getUserByEmail(email);
    if (dbUser) {
      LocalCache.set<UserModel>(email, dbUser, 300);
    }
    return dbUser;
  }

  public async createNewUser(user: UserModel): Promise<void> {
    await this._userRepository.createNewUser(user);
  }

  public async saveUser(user: UserModel): Promise<UserModel> {
    LocalCache.del(user.id);
    LocalCache.del(user.email);
    return await this._userRepository.saveUser(user);
  }

  public async getAllRegisterUserList(context: RequestContext): Promise<GetAllUsersResponse> {
    const users: Array<UserModel> = await this._userRepository.getAllRegisterUserList();
    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this.getAllRegisterUserList.name),
      message: USER_MESSAGES.ALL_USERS_RETRIEVED_SUCCESSFULLY,
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

  public async getUserBySocketId(socketId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userRepository.getUserBySocketId(socketId, relations);
  }

  public async getLoggedInUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    if (!conversationIds.length) {
      return [];
    }
    return await this._userRepository.getLoggedInUsersByConversationIds(conversationIds, relations);
  }

  public async getUserByResetPasswordToken(token: string): Promise<UserModel | null> {
    return await this._userRepository.getUserByResetPasswordToken(token);
  }

  public async getUser(getUserDto: GetUserDto): Promise<GetSingleUserResponse> {
    const { userId } = getUserDto;
    const user: UserModel | null = await this.getUserByUserId(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    return {
      user: user,
    };
  }

  public async updateUserDetails(updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const { context, userId, firstName, lastName, email } = updateUserDto;
    const dbUser = await this.getUserByUserId(userId);
    if (!dbUser) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    await this.updateUserByUserId(userId, {
      firstName,
      lastName,
      email,
    });
    context.logInfo({
      source: LOGS.GET_SOURCE(UserService.name, this.updateUserDetails.name),
      message: USER_MESSAGES.USER_HAS_BEEN_UPDATED_SUCCESSFULLY,
    });
    return {
      message: USER_MESSAGES.USER_HAS_BEEN_UPDATED_SUCCESSFULLY,
    };
  }

  public async deleteUser(deleteUserDto: DeleteUserDto): Promise<DeleteUserResponse> {
    const { userId, context } = deleteUserDto;

    await this._userRepository.deleteUser(userId);
    context.logInfo({
      source: LOGS.GET_SOURCE(UserService.name, this.deleteUser.name),
      message: USER_MESSAGES.USER_HAS_BEEN_DELETED_SUCCESSFULLY,
    });
    return {
      message: USER_MESSAGES.USER_HAS_BEEN_DELETED_SUCCESSFULLY,
    };
  }
}
