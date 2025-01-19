import UserRepository from '@src/repositories/v1/userRepository';
import { UserModel } from '@src/database/mysql/models/userModel';
import RequestContext from '@src/helpers/context';
import { LOGS } from '@src/constants';
import { USER_MESSAGES } from '@src/constants/messages';
import {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetUserResponse,
  UpdateUserResponse,
} from '@src/types/response/userResponse';
import ConversationService from './conversationService';
import CustomError from '@src/shared/errorHandler/customError';
import { DeleteUserDto, GetUserDto, UpdateUserDto } from '@src/dtos/userDto';

export default class UserService {
  private readonly _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  public async getUserByUserId(userId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userRepository.getUserByUserId(userId, relations);
  }

  public async updateUserByUserId(userId: string, model: Partial<UserModel>): Promise<void> {
    await this._userRepository.updateUserByUserId(userId, model);
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
  public async getAllUsers(context: RequestContext): Promise<GetAllUsersResponse> {
    const users: Array<UserModel> = await this._userRepository.getAllRegisterUserList();
    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this.getAllUsers.name),
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

  public async getUserIdBySocketId(socketId: string, relations?: Array<string>): Promise<UserModel | null> {
    return await this._userRepository.getUserIdBySocketId(socketId, relations);
  }

  public async getUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    return await this._userRepository.getUsersByConversationIds(conversationIds, relations);
  }

  public async getUserByUserIdAndConversationId(
    userId: string,
    conversationId: string,
    relations?: Array<string>,
  ): Promise<UserModel | null> {
    return await this._userRepository.getUserByUserIdAndConversationId(userId, conversationId, relations);
  }

  public async getLoggedInUsersByConversationIds(
    conversationIds: Array<string>,
    relations?: Array<string>,
  ): Promise<Array<UserModel>> {
    return await this._userRepository.getLoggedInUsersByConversationIds(conversationIds, relations);
  }

  public async getUserByResetPasswordToken(token: string): Promise<UserModel | null> {
    return await this._userRepository.getUserByResetPasswordToken(token);
  }

  public async getUser(getUserDto: GetUserDto): Promise<GetUserResponse> {
    const { userId } = getUserDto;
    const user: UserModel | null = await this._userRepository.getUser(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    return {
      message: USER_MESSAGES.USER_HAS_BEEN_RETRIEVED_SUCCESSFULLY,
    };
  }

  public async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    const { context } = updateUserDto;
    await this._userRepository.updateUser(updateUserDto);
    context.logInfo({
      source: LOGS.GET_SOURCE(UserService.name, this.updateUser.name),
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
