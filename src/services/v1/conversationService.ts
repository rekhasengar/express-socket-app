import { LOGS, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import { ConversationResponse, GetConversationsResponse } from '@src/types/response/conversationResponse';
import ConversationRepository from '@src/repositories/v1/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { CreateConversationDto, GetConversationMessageDto } from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { UserModel } from '@src/database/mysql/models/userModel';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import RolesEnum from '@src/enums/rolesEnum';
import { CONVERSATION_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';
import CustomError from '@src/shared/errorHandler/customError';

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

  public async createNewConversation(createConversationDto: CreateConversationDto): Promise<ConversationResponse> {
    const { context, userIds, groupName, isGroupChat } = createConversationDto;
    let { adminId } = createConversationDto;

    if (!userIds.length) {
      throw CustomError.getNotFoundError(USER_MESSAGES.AT_LEAST_ONE_USER_REQUIRED_FOR_THE_CONVERSATION);
    }

    userIds.push(adminId);
    const distinctUserIds: Array<string> = Array.from(new Set<string>(userIds));
    const dbUsers: Array<UserModel> = await this._userService.getAllUserByUserIds(distinctUserIds);

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
    if (isGroupChat && users.length > 1) {
      await this._createGroupConversation(users, adminId, groupName, context);
    } else {
      await this._createOneToOneConversation(users, context);
    }

    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this.createNewConversation.name),
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    });
    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    };
  }

  public async getConversations(
    getConversationMessageDto: GetConversationMessageDto,
  ): Promise<GetConversationsResponse> {
    const { userId, context } = getConversationMessageDto;

    const user: UserModel | null = await this._userService.getUserConversationsForGetConversationApi(userId);
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversations: Array<ConversationModel> = user.conversationMembers.map(
      (conversationMember: ConversationMemberModel): ConversationModel => {
        const conversation = conversationMember.conversation;
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
      source: LOGS.GET_SOURCE(ConversationService.name, this.getConversations.name),
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    });

    return {
      conversations: conversations,
    };
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

  private async _createOneToOneConversation(users: Array<UserModel>, context: RequestContext): Promise<void> {
    const conversationModel: ConversationModel = new ConversationModel();
    conversationModel.name = USER_CHAT_TYPE.ONE_TO_ONE_CHAT;
    conversationModel.isGroupChat = false;
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
      message: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_WAS_SUCCESSFULLY,
    });
  }

  private async _createGroupConversation(
    users: Array<UserModel>,
    adminId: string,
    groupName: string | undefined,
    context: RequestContext,
  ): Promise<void> {
    const conversationModel: ConversationModel = new ConversationModel();
    conversationModel.name = groupName || 'group chat';
    conversationModel.isGroupChat = true;
    const dbConversation: ConversationModel = await this._conversationRepository.saveConversation(conversationModel);

    const userRoleKey: number = getRoleKeyByName(RolesEnum.USER);
    const adminRoleKey: number = getRoleKeyByName(RolesEnum.ADMIN);

    const conversationMemberModels: Array<ConversationMemberModel> = [];
    for (const user of users) {
      const conversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = dbConversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = user.id === adminId ? adminRoleKey : userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }

    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
    context.logInfo({
      source: LOGS.GET_SOURCE(ConversationService.name, this._createOneToOneConversation.name),
      message: CONVERSATION_MESSAGES.GROUP_CONVERSATION_CREATED_WAS_SUCCESSFULLY,
    });
  }
}
