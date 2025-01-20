import HttpStatusCode from 'http-status-codes';

import ConversationService from '@service/v1/conversationService';
import { ConversationMemberModel } from '@src/database/mysql/models/conversationMemberModel';
import { SocketModel } from '@src/database/mysql/models/socketModel';
import SocketEventEnum from '@src/enums/socketEventEnum';
import {
  AddUsersInGroupEventRequest,
  AdminRenameGroupEventRequest,
  AdminUpdateRoleEventRequest,
  DeleteMessageSenderEventRequest,
  EventRequest,
  MessageStatusEventRequest,
  ReceiveMessageEventRequest,
  RemoveUserFromGroupEventRequest,
  SendMessageEventRequest,
  UserLeaveGroupEventRequest,
} from '@src/types/request/socketRequest';
import MessageService from '@service/v1/messageService';
import SocketConnector from './socketConnector';
import CustomError from '@src/shared/errorHandler/customError';
import {
  CONVERSATION_MESSAGE_MESSAGES,
  CONVERSATION_MESSAGES,
  ROLE_MESSAGES,
  USER_MESSAGES,
} from '@src/constants/messages';
import UserService from '@service/v1/userService';
import SocketService from '@service/v1/socketService';
import RolesEnum from '@src/enums/rolesEnum';
import { UserModel } from '@src/database/mysql/models/userModel';
import UserStatusEnum from '@src/enums/userStatusEnum';
import { getRoleKeyByName } from '@src/seeders/roleSeeder';
import ConversationMemberService from '@service/v1/conversationMemberService';
import { ConversationModel } from '@src/database/mysql/models/conversationModel';
import RoleService from '@service/v1/roleService';
import { RoleModel } from '@src/database/mysql/models/roleModel';
import { MessageStatusEnum } from '@src/enums/messageStatusEnum';
import MessageStatusService from '@service/v1/messageStatusService';
import { MessageStatusModel } from '@src/database/mysql/models/messageStatusModel';
import { MessageModel } from '@src/database/mysql/models/messageModel';

export default class SocketEventHandler {
  private readonly _conversationService: ConversationService;
  private readonly _messageService: MessageService;
  private readonly _messageStatusService: MessageStatusService;
  private readonly _userService: UserService;
  private readonly _socketService: SocketService;
  private readonly _conversationMemberService: ConversationMemberService;
  private readonly _roleService: RoleService;

  constructor() {
    this._conversationService = new ConversationService();
    this._messageService = new MessageService();
    this._messageStatusService = new MessageStatusService();
    this._userService = new UserService();
    this._socketService = new SocketService();
    this._conversationMemberService = new ConversationMemberService();
    this._roleService = new RoleService();
  }

  public async processSendMessageEvent(sendMessageEventRequest: SendMessageEventRequest): Promise<void> {
    const { conversationId, message, senderId } = sendMessageEventRequest;

    let dbConversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [senderId],
        ['members.user'],
      );
    dbConversation = this._validateConversation(dbConversation);
    let dbUser: UserModel | null = dbConversation.members[0].user;
    dbUser = this._validateUserModel(dbUser);
    const savedMessage: MessageModel = await this._messageService.saveMessage(message, dbConversation.key, dbUser.key);
    const receiveMessageRequest: ReceiveMessageEventRequest = {
      senderId: senderId,
      conversationId,
      message,
    };
    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(users, senderId, SocketEventEnum.ReceiveMessage, receiveMessageRequest);

    //Saving message status in the database.
    const messageStatusModel = new MessageStatusModel();
    messageStatusModel.messageKey = savedMessage.key;
    messageStatusModel.userKey = dbUser.key;
    messageStatusModel.status = MessageStatusEnum.SENT;
    messageStatusModel.timestamp = message.timestamp;
    messageStatusModel.timezone = message.timezone;
    await this._messageStatusService.insertMessageStatus(messageStatusModel);
  }

  public async processMessagesStatusEvent(messageStatusEventRequest: MessageStatusEventRequest): Promise<void> {
    const { conversationId, userId, messageId, status, timestamp, timezone } = messageStatusEventRequest;

    const dbMessage: MessageModel | null = await this._messageService.getMessageByConversationIdMessageIdAndUserId(
      conversationId,
      messageId,
      userId,
      ['conversation', 'conversation.members', 'conversation.members.user'],
    );
    if (!dbMessage) {
      throw CustomError.getNotFoundError(
        CONVERSATION_MESSAGE_MESSAGES.MESSAGE_NOT_FOUND_WITH_CONVERSATION_AND_MESSAGE_ID,
      );
    }
    let dbUser: UserModel | undefined = dbMessage.conversation?.members[0]?.user;
    dbUser = this._validateUserModel(dbUser);

    //saving message status.
    const messageStatusModel: MessageStatusModel = new MessageStatusModel();
    messageStatusModel.messageKey = dbMessage.key;
    messageStatusModel.userKey = dbUser.key;
    messageStatusModel.status = status;
    messageStatusModel.timestamp = timestamp;
    messageStatusModel.timezone = timezone;
    await this._messageStatusService.insertMessageStatus(messageStatusModel);
    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(users, userId, SocketEventEnum.MessageStatus, messageStatusEventRequest);
  }

  public async processConnectEvent(socketId: string): Promise<void> {
    let user: UserModel | null = await this._userService.getUserBySocketId(socketId, [
      'conversationMembers',
      'conversationMembers.conversation',
    ]);
    user = this._validateUserModel(user);
    const conversationIds: Array<string> = user.conversationMembers.map(
      (conversationMembers: ConversationMemberModel): string => {
        return conversationMembers.conversation.id;
      },
    );

    const userId = user.id;
    const dbUsers: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(conversationIds, [
      'sockets',
    ]);
    const users = dbUsers.filter((user: UserModel): boolean => user.id !== userId);
    SocketEventHandler.emitEventToUsers(users, userId, SocketEventEnum.UserStatus, {
      userId,
      status: UserStatusEnum.ONLINE,
    });
  }

  public async processDisconnectEvent(socketId: string): Promise<void> {
    let user: UserModel | null = await this._userService.getUserBySocketId(socketId, [
      'conversationMembers',
      'conversationMembers.conversation',
    ]);
    user = this._validateUserModel(user);
    const conversationIds: Array<string> = user.conversationMembers.map(
      (conversationMembers: ConversationMemberModel): string => {
        return conversationMembers.conversation.id;
      },
    );

    const [users] = await Promise.all([
      //we need to fetch unique users only
      this._userService.getLoggedInUsersByConversationIds(conversationIds, ['sockets']),
      this._socketService.removeSocket(socketId),
    ]);

    const userId = user.id;
    SocketEventHandler.emitEventToUsers(users, userId, SocketEventEnum.UserStatus, {
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

    const adminMember: ConversationMemberModel = conversation.members[0];
    this._validateAdminMember(adminMember);

    await this._conversationService.updateByConversationId(conversationId, groupName);
    //First we need to check all above condition then we need to call all users
    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(users, adminId, SocketEventEnum.RenameGroup, {
      adminId,
      conversationId,
      groupName,
    });
  }

  public async processAddUsersInGroupEvent(addUserInGroupEventRequest: AddUsersInGroupEventRequest): Promise<void> {
    const { conversationId, userIds } = addUserInGroupEventRequest;
    let { adminId } = addUserInGroupEventRequest;
    adminId = adminId.toLowerCase();

    let conversation: ConversationModel | null = await this._conversationService.getConversationByConversationId(
      conversationId,
      ['members', 'members.user', 'members.user.sockets'],
    );
    conversation = this._validateConversation(conversation);

    //validating admin and its role.
    const conversationOldMembers: ConversationMemberModel[] = conversation.members;
    const adminMember: ConversationMemberModel | undefined = conversationOldMembers.find(
      (member: ConversationMemberModel): boolean => {
        return member.user.id.toLowerCase() == adminId;
      },
    );
    this._validateAdminMember(adminMember);

    const userIdsToAddInConversation: string[] = userIds.filter((userId: string): boolean => {
      const conversationMember: ConversationMemberModel | undefined = conversationOldMembers.find(
        (member: ConversationMemberModel): boolean => {
          return member.user.id.toLowerCase() === userId.toLowerCase();
        },
      );
      return conversationMember ? false : true;
    });
    if (!userIdsToAddInConversation.length) {
      return;
    }

    const usersToAddInConversation: UserModel[] = await this._userService.getAllUserByUserIds(
      userIdsToAddInConversation,
      ['sockets'],
    );
    const newConversationMemberModels: ConversationMemberModel[] = [];
    const userRoleKey: number = getRoleKeyByName(RolesEnum.USER);
    for (const userToAddInConversation of usersToAddInConversation) {
      const newConversationMemberModel = new ConversationMemberModel();
      newConversationMemberModel.conversationKey = conversation.key;
      newConversationMemberModel.userKey = userToAddInConversation.key;
      newConversationMemberModel.roleKey = userRoleKey;
      newConversationMemberModels.push(newConversationMemberModel);
    }
    await this._conversationMemberService.insertConversationMembers(newConversationMemberModels);

    //sending event to old users that new user added.
    const conversationOldUsers: UserModel[] = conversationOldMembers.map(
      (oldMember: ConversationMemberModel): UserModel => oldMember.user,
    );
    SocketEventHandler.emitEventToUsers(conversationOldUsers, adminId, SocketEventEnum.AddUserInGroup, {
      adminId,
      conversationId,
      userIds: userIdsToAddInConversation,
    });
    //sending event to users who added in the conversation.
    SocketEventHandler.emitEventToUsers(usersToAddInConversation, adminId, SocketEventEnum.JoinChat, {
      conversationId,
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
      const adminMemberCount: number =
        await this._conversationMemberService.getAdminMemberCountByConversationId(conversationId);
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

    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(users, userId, SocketEventEnum.LeaveGroup, userLeaveGroupEventRequest);
  }

  public async processRemoveUserFromGroupEvent(
    removeUserFromGroupEventRequest: RemoveUserFromGroupEventRequest,
  ): Promise<void> {
    const { adminId, userId, conversationId } = removeUserFromGroupEventRequest;

    let conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [adminId, userId],
        ['members', 'members.user', 'members.role'],
      );
    conversation = this._validateConversation(conversation);

    const conversationMembers = conversation.members;
    let adminMember: ConversationMemberModel | undefined, userMember: ConversationMemberModel | undefined;
    for (const conversationMember of conversationMembers) {
      const conversationMemberUser = conversationMember.user;
      if (conversationMemberUser.id == adminId) adminMember = conversationMember;
      if (conversationMemberUser.id == userId) userMember = conversationMember;
    }
    this._validateAdminMember(adminMember);
    userMember = this._validateUserMember(userMember);

    await this._conversationMemberService.deleteByConversationMemberId(userMember.id);
    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(
      users,
      adminId,
      SocketEventEnum.RemoveUserFromGroup,
      removeUserFromGroupEventRequest,
    );
  }

  public async processUpdateUserRoleInGroupEvent(
    adminUpdateRoleEventRequest: AdminUpdateRoleEventRequest,
  ): Promise<void> {
    const { adminId, userId, roleId, conversationId } = adminUpdateRoleEventRequest;

    let conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIds(
        conversationId,
        [userId, adminId],
        ['members', 'members.user', 'members.user.sockets', 'members.role'],
      );
    conversation = this._validateConversation(conversation);

    const conversationMembers = conversation.members;
    let adminMember: ConversationMemberModel | undefined, userMember: ConversationMemberModel | undefined;
    for (const conversationMember of conversationMembers) {
      const conversationMemberUser = conversationMember.user;
      if (conversationMemberUser.id == adminId) adminMember = conversationMember;
      if (conversationMemberUser.id == userId) userMember = conversationMember;
    }
    this._validateAdminMember(adminMember);
    userMember = this._validateUserMember(userMember);

    const role: RoleModel | null = await this._roleService.getRoleByRoleId(roleId);
    if (!role) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, ROLE_MESSAGES.USER_ROLES_COULD_NOT_BE_FOUND);
    }
    await this._conversationMemberService.updateByConversationMemberId(userMember.id, { roleKey: role.key });

    //We only need to send the user role update event to the user whose role has been updated.
    SocketEventHandler.emitEventToUsers(
      [userMember.user],
      adminId,
      SocketEventEnum.UpdateUserRoleInGroup,
      adminUpdateRoleEventRequest,
    );
  }

  public async processDeleteMessageEvent(deleteMessageSenderEventRequest: DeleteMessageSenderEventRequest) {
    const { conversationId, userId, messageId } = deleteMessageSenderEventRequest;

    const conversation: ConversationModel | null =
      await this._conversationService.getConversationByConversationIdAndUserIdAndMessageId(
        conversationId,
        userId,
        messageId,
      );
    this._validateConversation(conversation);
    await this._messageService.deleteUserMessageByMessageId(messageId);
    const users: Array<UserModel> = await this._userService.getLoggedInUsersByConversationIds(
      [conversationId],
      ['sockets'],
    );
    SocketEventHandler.emitEventToUsers(users, userId, SocketEventEnum.DeleteMessage, {
      conversationId,
      messageId,
    });
  }

  public static emitEventToUsers(
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

  private _validateConversation(conversation?: ConversationModel | null): ConversationModel {
    if (!conversation) {
      throw CustomError.getNotFoundError(CONVERSATION_MESSAGES.CONVERSATION_NOT_FOUND);
    }
    return conversation;
  }

  private _validateAdminMember(adminMember?: ConversationMemberModel): ConversationMemberModel {
    if (!adminMember) {
      throw CustomError.getNotFoundError(USER_MESSAGES.ADMIN_NOT_FOUND);
    }
    if (adminMember.role.name !== RolesEnum.ADMIN) {
      throw CustomError.getBadRequestError(USER_MESSAGES.YOU_DO_NOT_HAVE_ADMIN_PERMISSION);
    }
    return adminMember;
  }

  private _validateUserModel(user?: UserModel | null): UserModel {
    if (!user) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  private _validateUserMember(conversationMember?: ConversationMemberModel | null): ConversationMemberModel {
    if (!conversationMember) {
      throw CustomError.getNotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }
    return conversationMember;
  }

  private static _emitEventToSocketConnections(
    sockets: Array<SocketModel>,
    eventType: SocketEventEnum,
    eventRequest: EventRequest,
  ): void {
    if (!sockets.length) return;
    for (const socket of sockets) {
      SocketConnector.emitEvent(socket.socketId, eventType, eventRequest);
    }
  }
}
