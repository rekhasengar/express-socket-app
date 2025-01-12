import HttpStatusCode from 'http-status-codes';

import { ERROR_MESSAGES, SUCCESS_MESSAGE, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import { ConversationResponse, GetActiveUsersResponse } from '@src/types/response/conversationResponse';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { CreateConversationDto, DeleteConversationDto } from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import MessageService from './messageService';
import { UserModel } from '@src/database/mysql/models/userModel';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import RolesEnum from '@src/enums/rolesEnum';

export default class ConversationService {
  private readonly _userService: UserService;
  private readonly _conversationRepository: ConversationRepository;
  private readonly _conversationMemberService: ConversationMemberService;
  private readonly _messageService: MessageService;

  constructor() {
    this._userService = new UserService();
    this._conversationRepository = new ConversationRepository();
    this._conversationMemberService = new ConversationMemberService();
    this._messageService = new MessageService();
  }

  public async getByConversationId(conversationId: string, relations?: string[]): Promise<ConversationModel | null> {
    return this._conversationRepository.getByConversationId(conversationId, relations);
  }

  //TODO: need to move in to the users.
  public async getAllActiveUserList(): Promise<GetActiveUsersResponse> {
    const users = await this._userService.getCurrentActiveAllUsers();
    if (!users) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.ACTIVE_USERS_NOT_FOUND);
    }
    return {
      users: users,
    };
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

  public async deleteSingleConversation(deleteConversationDto: DeleteConversationDto): Promise<ConversationResponse> {
    await this._messageService.deleteSingleMessage(deleteConversationDto.senderId, deleteConversationDto.messageId);
    return {
      message: SUCCESS_MESSAGE.CONVERSATION_DELETED_SUCCESSFULLY,
    };
  }

  // public async renameGroup(adminId: string, conversationId: number, groupName: string): Promise<void> {
  //   const userData = await this._userService.getUserById(adminId);
  //   if (!userData) {
  //     throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.USERS_NOT_EXISTS);
  //   }
  //   const roleData = await this._conversationMemberService.getConversationMemberDetailById(userData.key);
  //   if (!roleData) {
  //     throw new CustomError(HttpStatusCode.NOT_FOUND, ERROR_MESSAGES.USER_ROLE_NOT_FOUND);
  //   }
  //   if (roleData.role.name !== RolesEnum.ADMIN) {
  //     throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.ADMIN_CAN_CHANGE_GROUP_NAME);
  //   }
  //   await this._conversationRepository.updateConversationName(conversationId, false, groupName);
  // }

  private async _createOneToOneConversation(createConversationDto: CreateConversationDto): Promise<void> {
    const { usersId } = createConversationDto;
    let { adminId } = createConversationDto;
    usersId.push(adminId);

    const distinctUserIds = Array.from(new Set<string>(usersId));
    const dbUsers = await this._userService.getAllUserByIds(distinctUserIds);

    adminId = adminId.trim().toLowerCase();
    let admin: UserModel | undefined;
    const users = dbUsers.filter((user: UserModel): boolean => {
      if (user.id.toLowerCase() == adminId) {
        admin = user;
        return false;
      } else {
        return true;
      }
    });

    if (!admin) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USER_NOT_EXISTS);
    }
    if (!users) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, ERROR_MESSAGES.USERS_NOT_EXISTS);
    }

    const conversationModel = new ConversationModel();
    conversationModel.name = USER_CHAT_TYPE.ONE_TO_ONE_CHAT;
    conversationModel.isGroupChat = false;

    const dbConversation = await this._conversationRepository.saveConversation(conversationModel);

    users.push(admin);
    const userRoleKey = getRoleKeyByName(RolesEnum.USER);
    const conversationMemberModels: ConversationMemberModel[] = [];
    for (const user of users) {
      const conversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = dbConversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }

    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
  }

  private async _createGroupConversation(createConversationDto: CreateConversationDto): Promise<void> {
    const { adminId, usersId, groupName } = createConversationDto;

    const [admin, users] = await Promise.all([
      this._userService.getUserById(adminId),
      this._userService.getAllUserByIds(usersId),
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

    const conversation = await this._conversationRepository.saveConversation(conversationData);

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
