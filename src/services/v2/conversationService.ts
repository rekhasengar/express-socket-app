import HttpStatusCode from 'http-status-codes';

import { LOGS, LOGS_ACTIONS, USER_CHAT_TYPE } from '@src/constants';
import UserService from './userService';
import {
  ConversationResponse,
  GetActiveUsersResponse,
  GetConversationsResponse,
} from '@src/types/response/conversationResponse';
import CustomError from '@src/shared/errorHandler/customError';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import { CreateConversationDto, DeleteConversationMessageDto } from '@src/dtos/conversationDto';
import ConversationMemberService from './conversationMemberService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import MessageService from './messageService';
import { UserModel } from '@src/database/mysql/models/userModel';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import RolesEnum from '@src/enums/rolesEnum';
import { CONVERSATION_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import RequestContext from '@src/helpers/context';

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
  public async getAllActiveUserList(context: RequestContext): Promise<GetActiveUsersResponse> {
    const users = await this._userService.getCurrentActiveAllUsers();
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

  public async createNewConversation(
    createConversationDto: CreateConversationDto,
    context: RequestContext,
  ): Promise<ConversationResponse> {
    if (!createConversationDto.usersId.length) {
      context.logError({
        message: USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION,
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.createNewConversation.name),
        action: LOGS_ACTIONS.CONVERSATION,
      });
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.ONE_USER_COMPULSORY_FOR_CONVERSATION);
    }
    if (createConversationDto.usersId.length === 1) {
      await this._createOneToOneConversation(createConversationDto);
    }
    context.logInfo({
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.createNewConversation.name),
      action: LOGS_ACTIONS.CONVERSATION,
    });
    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_CREATED_SUCCESSFULLY,
    };
  }

  public async deleteConversationMessage(
    deleteConversationDto: DeleteConversationMessageDto,
    context: RequestContext,
  ): Promise<ConversationResponse> {
    await this._messageService.deleteSingleMessage(
      deleteConversationDto.userId,
      deleteConversationDto.messageId,
      deleteConversationDto.conversationId,
    );
    context.logInfo({
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY,
      source: LOGS.SUCCESS_MESSAGE(ConversationService.name, this.createNewConversation.name),
      action: LOGS_ACTIONS.CONVERSATION,
    });
    return {
      message: CONVERSATION_MESSAGES.CONVERSATION_MESSAGE_DELETED_SUCCESSFULLY,
    };
  }

  public async getConversations(userId: string, context: RequestContext): Promise<GetConversationsResponse> {
    const user = await this._userService.getUserConversationsForGetConversationApi(userId);
    if (!user) {
      context.logError({
        message: USER_MESSAGES.USER_NOT_FOUND,
        source: LOGS.ERROR_MESSAGE(ConversationService.name, this.createNewConversation.name),
        action: LOGS_ACTIONS.CONVERSATION,
      });
      throw new CustomError(HttpStatusCode.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversations = user.conversationMembers.map(
      (conversationMember: ConversationMemberModel): ConversationModel => {
        const conversation = conversationMember.conversation;
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
    return {
      conversations: conversations,
    };
  }

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
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.ADMIN_NOT_FOUND);
    }
    if (!users) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.USER_NOT_FOUND);
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
}
