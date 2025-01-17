import HttpStatusCode from 'http-status-codes';

import ConversationService from '@service/v2/conversationService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { SocketModel } from '@src/database/mysql/models/socketModel';
import SocketEventEnum from '@src/enums/socketEventEnum';
import {
  AddUsersInGroupEventRequest,
  AdminRenameGroupEventRequest,
  AdminUpdateRoleEventRequest,
  EventRequest,
  ReceiveMessageEventRequest,
  RemoveUserFromGroupEventRequest,
  SendMessageEventRequest,
  UserLeaveGroupEventRequest,
} from '@src/types/request/socketRequest';
import MessageService from '@service/v2/messageService';
import SocketConnector from './socketConnector';
import CustomError from '@src/shared/errorHandler/customError';
import { CONVERSATION_MESSAGES, ROLE_MESSAGES, USER_MESSAGES } from '@src/constants/messages';
import UserService from '@service/v2/userService';
import SocketService from '@service/v2/socketService';
import RolesEnum from '@src/enums/rolesEnum';
import { UserModel } from '@src/database/mysql/models/userModel';
import UserStatusEnum from '@src/enums/userStatusEnum';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import ConversationMemberService from '@service/v2/conversationMemberService';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import RoleService from '@service/v2/roleService';
import { RoleModel } from '@src/database/mysql/models/roleModel';

export default class SocketEventHandler {
  private readonly _conversationService: ConversationService;
  private readonly _messageService: MessageService;
  private readonly _userService: UserService;
  private readonly _socketService: SocketService;
  private readonly _conversationMemberService: ConversationMemberService;
  private readonly _roleService: RoleService;

  constructor() {
    this._conversationService = new ConversationService();
    this._messageService = new MessageService();
    this._userService = new UserService();
    this._socketService = new SocketService();
    this._conversationMemberService = new ConversationMemberService();
    this._roleService = new RoleService();
  }

  public async processSendMessageEvent(sendMessageEventRequest: SendMessageEventRequest): Promise<void> {
    const { conversationId, message } = sendMessageEventRequest;
    let { senderId } = sendMessageEventRequest;
    const dbConversation: ConversationModel | null = await this._conversationService.getConversationByConversationId(
      conversationId,
      ['members', 'members.user', 'members.user.sockets'],
    );
    if (!dbConversation) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    senderId = senderId.toLowerCase();
    const dbUser: ConversationMemberModel | undefined = dbConversation.members.find(
      (conversationMember: ConversationMemberModel): boolean => conversationMember.user.id.toLowerCase() == senderId,
    );
    if (!dbUser) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.USER_NOT_FOUND_IN_THIS_CONVERSATION);
    }

    await this._messageService.insertMessage(message, dbConversation.key, dbUser.key);
    const receiveMessageRequest: ReceiveMessageEventRequest = {
      senderId: senderId,
      conversationId,
      message,
    };
    for (const member of dbConversation.members) {
      if (member.user.id.toLowerCase() === senderId) {
        continue;
      }
      this._emitEventToSocketConnections(member.user.sockets, SocketEventEnum.ReceiveMessage, receiveMessageRequest);
    }
  }

  public async processDisconnectEvent(socketId: string): Promise<void> {
    const user: UserModel | null = await this._userService.getUserIdBySocketId(socketId, [
      'conversationMembers',
      'conversationMembers.conversation',
    ]);
    if (!user) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const conversationIds: Array<string> = user.conversationMembers.map(
      (conversationMembers: ConversationMemberModel): string => {
        return conversationMembers.conversation.id;
      },
    );

    const [users] = await Promise.all([
      //we need to fetch unique users only
      this._userService.getUsersByConversationIds(conversationIds, ['sockets']),
      this._socketService.removeSocket(socketId),
    ]);

    const userId = user.id;
    this._emitEventToUsers(users, userId, SocketEventEnum.UserStatus, {
      userId,
      status: UserStatusEnum.OFFLINE,
    });
  }

  public async processAdminRenameGroupEvent(adminRenameGroupEventRequest: AdminRenameGroupEventRequest): Promise<void> {
    const { adminId, conversationId, groupName } = adminRenameGroupEventRequest;

    const conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [adminId],
        ['members', 'members.role'],
      );
    if (!conversation || !conversation.isGroupChat) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const member: ConversationMemberModel = conversation.members[0];
    if (member.role.name !== RolesEnum.ADMIN) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.YOU_DO_NOT_HAVE_ADMIN_PERMISSION);
    }

    await this._conversationService.updateByConversationId(conversationId, groupName);
    //First we need to check all above condition then we need to call all users
    const users: Array<UserModel> = await this._userService.getUsersByConversationIds([conversationId], ['sockets']);
    this._emitEventToUsers(users, adminId, SocketEventEnum.RenameGroup, {
      adminId,
      conversationId,
      groupName,
    });
  }

  public async processAddUsersInGroupEvent(addUserInGroupEventRequest: AddUsersInGroupEventRequest): Promise<void> {
    const { conversationId, userIds } = addUserInGroupEventRequest;
    let { adminId } = addUserInGroupEventRequest;

    const conversation: ConversationModel | null = await this._conversationService.getConversationByConversationId(
      conversationId,
      ['members', 'members.user'],
    );
    if (!conversation) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const userIdsNotInConversation = userIds.filter((userId: string): boolean => {
      const conversationMember = conversation.members.find((member: ConversationMemberModel): boolean => {
        return member.user.id.toLowerCase() === userId.toLowerCase();
      });
      return conversationMember ? true : false;
    });
    if (userIdsNotInConversation) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.USERS_ALREADY_EXISTS_IN_CONVERSATION);
    }

    const conversationMemberUsers: Array<UserModel> = conversation.members.map(
      (conversationMember: ConversationMemberModel): UserModel => {
        return conversationMember.user;
      },
    );

    userIds.push(adminId);
    const distinctUserIds: Array<string> = Array.from(new Set<string>(userIds));
    const dbUsers: Array<UserModel> = await this._userService.getAllUserByUserIds(distinctUserIds, ['sockets']);

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

    const userRoleKey: number = getRoleKeyByName(RolesEnum.USER);
    const conversationMemberModels: Array<ConversationMemberModel> = [];
    for (const user of users) {
      const conversationMemberModel = new ConversationMemberModel();
      conversationMemberModel.conversationKey = conversation.key;
      conversationMemberModel.userKey = user.key;
      conversationMemberModel.roleKey = userRoleKey;
      conversationMemberModels.push(conversationMemberModel);
    }
    await this._conversationMemberService.insertConversationMembers(conversationMemberModels);
    this._emitEventToUsers(conversationMemberUsers, adminId, SocketEventEnum.JoinChat, {
      adminId,
      conversationId,
      userIds: userIds,
    });
  }

  public async processLeaveGroupEvent(userLeaveGroupEventRequest: UserLeaveGroupEventRequest): Promise<void> {
    const { userId, conversationId } = userLeaveGroupEventRequest;

    const conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [userId],
        ['members', 'members.user', 'members.role'],
      );
    if (!conversation || !conversation.isGroupChat) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const member: ConversationMemberModel = conversation.members[0];
    if (member.role.name === RolesEnum.ADMIN) {
      const adminMemberCount: number = await this._conversationMemberService.getAdminMemberCountByConversationId(
        conversationId,
      );
      if (adminMemberCount === 1) {
        const firstUserMember: ConversationMemberModel | null =
          await this._conversationMemberService.getFirstUserMemberByConversationId(conversationId);
        if (firstUserMember) {
          const adminRoleKey: number = getRoleKeyByName(RolesEnum.ADMIN);
          await this._conversationMemberService.updateByConversationMemberId(firstUserMember.id, {
            roleKey: adminRoleKey,
          });
        }
      }
    }
    await this._conversationMemberService.deleteByConversationMemberId(member.id);

    const users: Array<UserModel> = await this._userService.getUsersByConversationIds([conversationId], ['sockets']);
    this._emitEventToUsers(users, userId, SocketEventEnum.LeaveGroup, userLeaveGroupEventRequest);
  }

  public async processRemoveUserFromGroupEvent(
    removeUserFromGroupEventRequest: RemoveUserFromGroupEventRequest,
  ): Promise<void> {
    const { adminId, userId, conversationId } = removeUserFromGroupEventRequest;

    const conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [adminId, userId],
        ['members', 'members.user', 'members.role'],
      );
    if (!conversation) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }
  }

  public async processUpdateUserRoleInGroupEvent(adminUpdateRoleEvent: AdminUpdateRoleEventRequest): Promise<void> {
    const { adminId, userId, roleId, conversationId } = adminUpdateRoleEvent;

    const conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [userId, adminId],
        ['members', 'members.user', 'members.user.sockets', 'members.role'],
      );
    if (!conversation) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const adminMember: ConversationMemberModel | undefined = conversation.members.find(
      (conversationMember: ConversationMemberModel): boolean => {
        return conversationMember.user.id == adminId;
      },
    );
    if (!adminMember) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, USER_MESSAGES.ADMIN_NOT_FOUND);
    }
    if (adminMember.role.name !== RolesEnum.ADMIN) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, USER_MESSAGES.YOU_DO_NOT_HAVE_ADMIN_PERMISSION);
    }

    const userMember: ConversationMemberModel | undefined = conversation.members.find(
      (conversationMember: ConversationMemberModel): boolean => {
        return conversationMember.user.id == userId;
      },
    );
    if (!userMember) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, USER_MESSAGES.USER_NOT_FOUND);
    }

    const role: RoleModel | null = await this._roleService.getRoleByRoleId(roleId);
    if (!role) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ROLE_MESSAGES.USER_ROLE_NOT_FOUND);
    }

    await this._conversationMemberService.updateByConversationMemberId(userMember.id, { roleKey: role.key });

    const updateRoleUser: Array<UserModel> = conversation.members
      .filter((conversationMember: ConversationMemberModel) => conversationMember.user.id === userId)
      .map((conversationMember: ConversationMemberModel): UserModel => conversationMember.user);

    await this._emitEventToUsers(updateRoleUser, adminId, SocketEventEnum.UpdateUserRoleInGroup, {
      conversationId,
      adminId,
      userId,
      roleId,
    });
  }

  private _emitEventToSocketConnections(
    sockets: Array<SocketModel>,
    eventType: SocketEventEnum,
    eventRequest: EventRequest,
  ): void {
    if (!sockets.length) return;
    for (const socket of sockets) {
      SocketConnector.emitEvent(socket.socketId, eventType, eventRequest);
    }
  }

  private _emitEventToUsers(
    users: Array<UserModel>,
    userId: string,
    eventType: SocketEventEnum,
    request: EventRequest,
  ): void {
    if (!users.length) return;
    for (const user of users) {
      if (userId === user.id) {
        continue;
      }
      this._emitEventToSocketConnections(user.sockets, eventType, request);
    }
  }
}
