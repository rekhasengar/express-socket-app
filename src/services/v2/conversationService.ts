import HttpStatusCode from 'http-status-codes';

import { ERROR_MESSAGES, SUCCESS_MESSAGE, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import { ConversationResponse } from '@src/types/response/conversationResponse';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { CreateConversationDto } from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';

export default class ConversationService {
  private readonly _userService: UserService;
  private readonly _conversationRepository: ConversationRepository;
  private readonly _conversationMemberService: ConversationMemberService;

  constructor(
    userService: UserService,
    conversationRepository: ConversationRepository,
    conversationMemberService: ConversationMemberService,
  ) {
    this._userService = userService;
    this._conversationRepository = conversationRepository;
    this._conversationMemberService = conversationMemberService;
  }

  public async getAllActiveUserList(): Promise<ConversationResponse> {
    const users = await this._userService.getCurrentActiveAllUsers();
    if (!users) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }
    return {
      message: SUCCESS_MESSAGE.USERS_FETCHED_SUCCESSFULLY,
      body: users,
    };
  }

  public async checkGroupExistsOrNot(conversationId: number): Promise<ConversationModel | null> {
    return await this._conversationRepository.checkGroupExistsOrNot(conversationId);
  }

  public async createNewConversation(createConversationDto: CreateConversationDto): Promise<ConversationResponse> {
    if (!createConversationDto.usersId.length) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION);
    }
    if (createConversationDto.usersId.length === 1) {
      await this._createOneToOneConversation(createConversationDto);
    } else {
      await this._createGroupConversation(createConversationDto);
    }
    return {
      message: SUCCESS_MESSAGE.CONVERSATION_CREATED_SUCCESSFULLY,
    };
  }

  private async _createOneToOneConversation(createConversationDto: CreateConversationDto): Promise<void> {
    const { adminId, usersId } = createConversationDto;

    const [admin, users] = await Promise.all([
      this._userService.getUserById(adminId),
      this._userService.getAllUserById(usersId),
    ]);

    if (!admin) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_EXISTS);
    }
    if (!users) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USERS_NOT_EXISTS);
    }
    const conversationData = <ConversationModel>{
      name: USER_CHAT_TYPE.ONE_TO_ONE_CHAT,
      isGroupChat: false,
    };

    const conversations = await this._conversationRepository.addConversation(conversationData);

    const adminConversationMember = <ConversationMemberModel>{
      userKey: admin.key,
      conversationKey: conversations.key,
      roleKey: 1,
    };

    let conversationMemberData: ConversationMemberModel[] = [];
    for (const user of users) {
      conversationMemberData = [
        {
          userKey: user.key,
          conversationKey: conversations.key,
          roleKey: 1,
        } as ConversationMemberModel,
      ];
    }

    await Promise.all([
      this._conversationMemberService.addUserInConversationMember(adminConversationMember),
      this._conversationMemberService.addUsersInConversationMember(conversationMemberData),
    ]);
  }

  private async _createGroupConversation(createConversationDto: CreateConversationDto): Promise<void> {
    const { adminId, usersId, groupName } = createConversationDto;

    const [admin, users] = await Promise.all([
      this._userService.getUserById(adminId),
      this._userService.getAllUserById(usersId),
    ]);

    if (!admin) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_EXISTS);
    }
    if (!users) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USERS_NOT_EXISTS);
    }

    const conversationData = <ConversationModel>{
      name: groupName,
      isGroupChat: false,
    };

    const conversation = await this._conversationRepository.addConversation(conversationData);

    const adminConversationMember = <ConversationMemberModel>{
      userKey: admin.key,
      conversationKey: conversation.key,
      roleKey: 2,
    };

    const conversationMemberData: ConversationMemberModel[] = [];
    for (const user of users) {
      conversationMemberData.push({
        userKey: user.key,
        conversationKey: conversation.key,
        roleKey: 1,
      } as ConversationMemberModel);
    }

    await Promise.all([
      this._conversationMemberService.addUserInConversationMember(adminConversationMember),
      this._conversationMemberService.addUsersInConversationMember(conversationMemberData),
    ]);
  }
}
