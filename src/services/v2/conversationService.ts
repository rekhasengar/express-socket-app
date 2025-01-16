import HttpStatusCode from 'http-status-codes';

import { LOGS, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import { ConversationResponse, GetConversationsResponse } from '@src/types/response/conversationResponse';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import {
  CreateConversationDto,
  DeleteConversationMessageDto,
  GetConversationMessageDto,
} from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import MessageService from './messageService';
import { UserModel } from '@src/database/mysql/models/userModel';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import RolesEnum from '@src/enums/rolesEnum';
import { CONVERSATION_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';
import { getMessage } from '@src/config/messages';
import { CustomErrorHandler } from '@src/helpers/customErrorHandler';

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

  public async getConversationByConversationId(
    conversationId: string,
    relations?: string[],
  ): Promise<ConversationModel | null> {
    return this._conversationRepository.getConversationByConversationId(conversationId, relations);
  }

  public async createNewConversation(createConversationDto: CreateConversationDto): Promise<ConversationResponse> {
    const { context, adminId, userIds, groupName, locale } = createConversationDto;

    if (!userIds.length) {
      context.logError({
        message: getMessage(USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.createNewConversation.name),
        action: USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION,
      });
      const message = getMessage(USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION, locale);
      throw new CustomErrorHandler(
        HttpStatusCode.BAD_REQUEST,
        message,
        USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION,
      );
    }

    if (userIds.length === 1 && !groupName) {
      await this._createOneToOneConversation(adminId, userIds, context, locale);
    } else {
      await this._createGroupConversation(adminId, userIds, groupName, context, locale);
    }

    context.logInfo({
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.createNewConversation.name),
      action: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    });
    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    };
  }

  public async deleteConversationMessage(
    deleteConversationDto: DeleteConversationMessageDto,
  ): Promise<ConversationResponse> {
    const { userId, messageId, conversationId, context } = deleteConversationDto;
    await this._messageService.deleteSingleMessage(userId, messageId, conversationId);

    context.logInfo({
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.createNewConversation.name),
      action: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY,
    });

    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY,
    };
  }
  public async getConversations(
    getConversationMessageDto: GetConversationMessageDto,
  ): Promise<GetConversationsResponse> {
    const { userId, context, locale } = getConversationMessageDto;

    const user = await this._userService.getUserConversationsForGetConversationApi(userId);
    if (!user) {
      context.logError({
        message: getMessage(USER_MESSAGES.USER_NOT_FOUND),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.createNewConversation.name),
        action: USER_MESSAGES.USER_NOT_FOUND,
      });
      const message = getMessage(USER_MESSAGES.USER_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.NOT_FOUND, message, USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversations = user.conversationMembers.map(
      (conversationMember: ConversationMemberModel): ConversationModel => {
        const conversation = conversationMember.conversation;

        conversation.members = conversation.members.filter(
          (member: ConversationMemberModel): boolean => member.user.id.toLowerCase() !== userId.toLowerCase(),
        );

        if (!conversation.isGroupChat) {
          const secondMember = conversation.members.find((member: ConversationMemberModel): boolean => {
            return member.user.id.toLowerCase() !== userId.toLowerCase();
          });
          if (secondMember) {
            conversation.name = `${secondMember.user.firstName} ${secondMember.user.lastName}`;
          }
        }
        return conversation;
      },
    );

    context.logInfo({
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.getConversations.name),
      action: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
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
    userIds: string[],
    relations?: string[],
  ): Promise<ConversationModel | null> {
    return await this._conversationRepository.getConversationByConversationIdAndUserIds(
      conversationId,
      userIds,
      relations,
    );
  }

  private async _createOneToOneConversation(
    adminId: string,
    userIds: string[],
    context: RequestContext,
    locale: string,
  ): Promise<void> {
    userIds.push(adminId);

    const distinctUserIds = Array.from(new Set<string>(userIds));
    const dbUsers = await this._userService.getAllUserByUserIds(distinctUserIds);

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
      context.logError({
        message: getMessage(USER_MESSAGES.ADMIN_NOT_FOUND),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this._createOneToOneConversation.name),
        action: USER_MESSAGES.ADMIN_NOT_FOUND,
      });
      const message = getMessage(USER_MESSAGES.ADMIN_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.BAD_REQUEST, message, USER_MESSAGES.ADMIN_NOT_FOUND);
    }
    if (!users) {
      context.logError({
        message: getMessage(USER_MESSAGES.USER_NOT_FOUND),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this._createOneToOneConversation.name),
        action: USER_MESSAGES.USER_NOT_FOUND,
      });
      const message = getMessage(USER_MESSAGES.USER_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.BAD_REQUEST, message, USER_MESSAGES.USER_NOT_FOUND);
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
    context.logInfo({
      message: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this._createOneToOneConversation.name),
      action: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY,
    });
  }

  private async _createGroupConversation(
    adminId: string,
    userIds: string[],
    groupName: string | undefined,
    context: RequestContext,
    locale: string,
  ): Promise<void> {
    userIds.push(adminId);

    const distinctUserIds = Array.from(new Set<string>(userIds));
    const dbUsers = await this._userService.getAllUserByUserIds(distinctUserIds);

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
      context.logError({
        message: getMessage(USER_MESSAGES.ADMIN_NOT_FOUND),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this._createGroupConversation.name),
        action: USER_MESSAGES.ADMIN_NOT_FOUND,
      });
      const message = getMessage(USER_MESSAGES.ADMIN_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.BAD_REQUEST, message, USER_MESSAGES.ADMIN_NOT_FOUND);
    }
    if (!users) {
      context.logError({
        message: getMessage(USER_MESSAGES.USER_NOT_FOUND),
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this._createGroupConversation.name),
        action: USER_MESSAGES.USER_NOT_FOUND,
      });
      const message = getMessage(USER_MESSAGES.USER_NOT_FOUND, locale);
      throw new CustomErrorHandler(HttpStatusCode.BAD_REQUEST, message, USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversationModel = new ConversationModel();
    conversationModel.name = groupName || 'group chat';
    conversationModel.isGroupChat = true;
    const dbConversation = await this._conversationRepository.saveConversation(conversationModel);

    users.push(admin);
    const userRoleKey = getRoleKeyByName(RolesEnum.USER);
    const adminRoleKey = getRoleKeyByName(RolesEnum.ADMIN);
    const conversationMemberModels: ConversationMemberModel[] = [];
    for (const user of users) {
      const conversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = dbConversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = user.id === adminId ? adminRoleKey : userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }

    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
    context.logInfo({
      message: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this._createOneToOneConversation.name),
      action: CONVERSATION_MESSAGES.ONE_TO_ONE_CONVERSATION_CREATED_SUCCESSFULLY,
    });
  }
}
