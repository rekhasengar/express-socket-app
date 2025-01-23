import { LOGS, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import {
  CreateConversationResponse,
  GetConversationResponse,
  GetConversationsResponse,
} from '@src/types/response/conversationResponse';
import ConversationRepository from '@src/repositories/v1/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { CreateConversationDto, GetConversationDto, GetConversationMessageDto } from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { UserModel } from '@src/database/mysql/models/userModel';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import RolesEnum from '@src/enums/rolesEnum';
import { CONVERSATION_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';
import CustomError from '@src/shared/errorHandler/customError';
import SocketEventHandler from '@src/socket/socketEventHandler';
import SocketEventEnum from '@src/enums/socketEventEnum';

export default class ConversationService {
  private readonly _userService: UserService;
  private readonly _conversationRepository: ConversationRepository;
  private readonly _conversationMemberService: ConversationMemberService;

  constructor() {
    this._userService = new UserService();
    this._conversationRepository = new ConversationRepository();
    this._conversationMemberService = new ConversationMemberService();
  }

  public async getConversationByConversationId(
    conversationId: string,
    relations?: Array<string>,
  ): Promise<ConversationModel | null> {
    return this._conversationRepository.getConversationByConversationId(conversationId, relations);
  }

  public async createNewConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<CreateConversationResponse> {
    const { context, userIds, groupName, isGroupChat } = createConversationDto;
    let { adminId } = createConversationDto;

    if (!userIds.length) {
      throw CustomError.getNotFoundError(USER_MESSAGES.AT_LEAST_ONE_USER_REQUIRED_FOR_THE_CONVERSATION);
    }

    userIds.push(adminId);
    const distinctUserIds: Array<string> = Array.from(new Set<string>(userIds));
    const dbUsers: Array<UserModel> = await this._userService.getAllUserByUserIds(distinctUserIds, ['sockets']);

    adminId = adminId.trim().toLowerCase();
    let admin: UserModel | undefined;
    const users: Array<UserModel> = dbUsers.filter((user: UserModel): boolean => {
      if (user.id.toLowerCase() === adminId) {
        admin = user;
        return false;
      } else {
        return true;
      }
    });

    if (!admin) {
      throw CustomError.getNotFoundError(USER_MESSAGES.ADMIN_NOT_FOUND);
    }

    users.push(admin);
    let conversation: ConversationModel;
    if ((isGroupChat && users.length > 2) || users.length > 2) {
      conversation = await this._createGroupConversation(users, admin, groupName, context);
    } else {
      conversation = await this._createOneToOneConversation(users, admin, context);
    }

    SocketEventHandler.emitEventToUsers(users, adminId, SocketEventEnum.JoinChat, {
      conversationId: conversation.id,
    });

    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this.createNewConversation.name),
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    });
    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    };
  }

  public async getAllConversationsByUserId(
    getConversationMessageDto: GetConversationMessageDto,
  ): Promise<GetConversationsResponse> {
    const { userId, context } = getConversationMessageDto;

    const user: UserModel | null = await this._userService.getUserConversationsForGetConversationApi(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversations: Array<ConversationModel> = user.conversationMembers.map(
      (conversationMember: ConversationMemberModel): ConversationModel => {
        const conversation: ConversationModel = conversationMember.conversation;
        conversation.members = conversation.members.filter(
          (member: ConversationMemberModel): boolean => member.user.id.toLowerCase() !== userId.toLowerCase(),
        );
        if (!conversation.isGroupChat) {
          const secondMember: ConversationMemberModel | undefined = conversation.members.find(
            (member: ConversationMemberModel): boolean => {
              return member.user.id.toLowerCase() !== userId.toLowerCase();
            },
          );
          if (secondMember) {
            conversation.name = `${secondMember.user.firstName} ${secondMember.user.lastName}`;
          }
        }
        return conversation;
      },
    );

    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this.getAllConversationsByUserId.name),
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    });

    return {
      conversations: conversations,
    };
  }

  public async getConversation(getConversationDto: GetConversationDto): Promise<GetConversationResponse> {
    const { conversationId } = getConversationDto;
    let { userId } = getConversationDto;
    userId = userId.toLowerCase();
    const conversation: ConversationModel | null =
      await this._conversationRepository.getConversationByConversationIdForApi(conversationId);
    if (!conversation) {
      throw CustomError.getNotFoundError(CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }
    if (!conversation.isGroupChat) {
      const secondMember: ConversationMemberModel | undefined = conversation.members.find(
        (member: ConversationMemberModel): boolean => member.user.id.toLowerCase() != userId,
      );
      if (secondMember) {
        conversation.name = `${secondMember.user.firstName} ${secondMember.user.lastName}`;
      }
    }
    return { conversation };
  }

  public async updateByConversationId(conversationId: string, groupName: string): Promise<void> {
    await this._conversationRepository.updateByConversationId(conversationId, {
      name: groupName,
    });
  }

  public async getConversationByConversationIdAndUserIds(
    conversationId: string,
    userIds: Array<string>,
    relations?: Array<string>,
  ): Promise<ConversationModel | null> {
    return await this._conversationRepository.getConversationByConversationIdAndUserIds(
      conversationId,
      userIds,
      relations,
    );
  }

  public async getConversationByConversationIdAndUserIdAndMessageId(
    conversationId: string,
    userId: string,
    messageId: string,
  ): Promise<ConversationModel | null> {
    return await this._conversationRepository.getConversationByConversationIdAndUserIdAndMessageId(
      conversationId,
      userId,
      messageId,
    );
  }

  private async _createOneToOneConversation(
    users: Array<UserModel>,
    admin: UserModel,
    context: RequestContext,
  ): Promise<ConversationModel> {
    const conversationModel: ConversationModel = new ConversationModel();
    conversationModel.name = USER_CHAT_TYPE.ONE_TO_ONE_CHAT;
    conversationModel.isGroupChat = false;
    conversationModel.createdByKey = admin.key;
    const dbConversation: ConversationModel = await this._conversationRepository.saveConversation(conversationModel);

    const userRoleKey: number = getRoleKeyByName(RolesEnum.USER);
    const conversationMemberModels: Array<ConversationMemberModel> = [];
    for (const user of users) {
      const conversationMemberModel: ConversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = dbConversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }

    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this._createOneToOneConversation.name),
      message: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY,
    });
    return dbConversation;
  }

  private async _createGroupConversation(
    users: Array<UserModel>,
    admin: UserModel,
    groupName: string | undefined,
    context: RequestContext,
  ): Promise<ConversationModel> {
    const conversationModel: ConversationModel = new ConversationModel();
    conversationModel.name = groupName || 'group chat';
    conversationModel.isGroupChat = true;
    conversationModel.createdByKey = admin.key;
    const dbConversation: ConversationModel = await this._conversationRepository.saveConversation(conversationModel);

    const userRoleKey: number = getRoleKeyByName(RolesEnum.USER);
    const adminRoleKey: number = getRoleKeyByName(RolesEnum.ADMIN);

    const conversationMemberModels: Array<ConversationMemberModel> = [];
    for (const user of users) {
      const conversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = dbConversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = user.id === admin.id ? adminRoleKey : userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }

    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this._createGroupConversation.name),
      message: CONVERSATION_MESSAGES.GROUP_CONVERSATION_CREATED_SUCCESSFULLY,
    });
    return dbConversation;
  }
}
