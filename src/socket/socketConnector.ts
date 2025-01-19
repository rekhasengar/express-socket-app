import { Server, Socket } from 'socket.io';

import { validateJwtToken } from '@src/utils/jwt';
import SocketEventEnum from '@src/enums/socketEventEnum';
import UserService from '@service/v1/userService';
import SocketService from '@service/v1/socketService';
import {
  AddUsersInGroupEventRequest,
  AdminRenameGroupEventRequest,
  AdminUpdateRoleEventRequest,
  EventRequest,
  MessageStatusEventRequest,
  RemoveUserFromGroupEventRequest,
  SendMessageEventRequest,
  SocketErrorRequest,
  SocketRequest,
  UserLeaveGroupEventRequest,
} from '@src/types/request/socketRequest';
import SocketEventHandler from './socketEventHandler';
import CustomError from '@src/shared/errorHandler/customError';
import { JWT_OBJECT } from '@src/types/jwt';
import { UserModel } from '@src/database/mysql/models/userModel';

export default class SocketConnector {
  private static _io: Server;

  public static async initialize(io: Server): Promise<void> {
    this._io = io;
    io.on('connection', async (socket: Socket) => {
      try {
        const socketEventHandler: SocketEventHandler = new SocketEventHandler();

        const decodedToken: JWT_OBJECT = this._checkAndVerifyToken(socket.handshake.auth.token);
        const userId: string | number = decodedToken.id;
        const userService: UserService = new UserService();
        const dbUser: UserModel | null = await userService.getUserByUserId(userId as string);
        if (!dbUser) {
          throw new Error('User not found.');
        }

        //storing socket connection details.
        const socketService: SocketService = new SocketService();
        await socketService.createSocketModel(socket.id, dbUser.key);
        // Handle events
        this._handleEvents(socket);

        // Emit connected event
        await socketEventHandler.processConnectEvent(socket.id);
        this._io.to(socket.id).emit(SocketEventEnum.Connected);
      } catch (error) {
        const customError: CustomError = CustomError.getCustomErrorObject(error);
        this.emitErrorEvent(socket.id, customError);
      }
    });
  }

  private static _handleEvents(socket: Socket) {
    const socketEventHandler: SocketEventHandler = new SocketEventHandler();

    socket.on('event', async (socketRequest: SocketRequest) => {
      try {
        await this._processEvents(socketRequest);
      } catch (error) {
        const customError: CustomError = CustomError.getCustomErrorObject(error);
        this.emitErrorEvent(socket.id, customError);
      }
    });

    socket.on(SocketEventEnum.Disconnect, async () => {
      const socketId: string = socket.id;
      await socketEventHandler.processDisconnectEvent(socketId);
    });
  }

  public static emitErrorEvent(socketId: string, error: CustomError): void {
    const socketErrorRequest: SocketErrorRequest = {
      status: error.status,
      message: error.message,
      name: error.name,
    };
    const errorEventRequest = {
      error: socketErrorRequest,
    };
    this._io.to(socketId).emit(SocketEventEnum.SocketError, errorEventRequest);
  }

  public static emitEvent(socketId: string, eventType: SocketEventEnum, eventRequest: EventRequest): void {
    this._io.to(socketId).emit(eventType, eventRequest);
  }

  private static _checkAndVerifyToken(token?: string) {
    if (!token) {
      throw new Error('Token Missing.');
    }

    //decoding token.
    const decodedToken: JWT_OBJECT | null = validateJwtToken(token);
    if (!decodedToken) {
      throw new Error('Invalid token.');
    }
    return decodedToken;
  }

  private static async _processEvents(socketRequest: SocketRequest) {
    const socketEventHandler: SocketEventHandler = new SocketEventHandler();
    switch (socketRequest.eventType) {
      case SocketEventEnum.SendMessage: {
        await socketEventHandler.processSendMessageEvent(socketRequest.data as SendMessageEventRequest);
        break;
      }
      case SocketEventEnum.MessageStatus: {
        await socketEventHandler.processMessagesStatusEvent(socketRequest.data as MessageStatusEventRequest);
        break;
      }
      case SocketEventEnum.AddUserInGroup: {
        await socketEventHandler.processAddUsersInGroupEvent(socketRequest.data as AddUsersInGroupEventRequest);
        break;
      }
      case SocketEventEnum.LeaveGroup: {
        await socketEventHandler.processLeaveGroupEvent(socketRequest.data as UserLeaveGroupEventRequest);
        break;
      }
      case SocketEventEnum.RemoveUserFromGroup: {
        await socketEventHandler.processRemoveUserFromGroupEvent(socketRequest.data as RemoveUserFromGroupEventRequest);
        break;
      }
      case SocketEventEnum.RenameGroup: {
        await socketEventHandler.processAdminRenameGroupEvent(socketRequest.data as AdminRenameGroupEventRequest);
        break;
      }
      case SocketEventEnum.UpdateUserRoleInGroup: {
        await socketEventHandler.processUpdateUserRoleInGroupEvent(socketRequest.data as AdminUpdateRoleEventRequest);
        break;
      }
    }
  }
}
