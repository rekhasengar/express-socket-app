import { Server, Socket } from 'socket.io';

import { validateJwtToken } from '@src/utils/jwt';
import SocketEventEnum from '@src/enums/socketEventEnum';
import UserService from '@service/v1/userService';
import SocketService from '@service/v1/socketService';
import {
  AddUsersInGroupEventRequest,
  AdminRenameGroupEventRequest,
  AdminUpdateRoleEventRequest,
  DeleteMessageSenderEventRequest,
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
    io.on('connection', async (socket: Socket): Promise<void> => {
      try {
        const socketEventHandler: SocketEventHandler = new SocketEventHandler();

        const decodedToken: JWT_OBJECT = this._checkAndVerifyToken(socket.handshake.auth.token);
        const userId: string | number = decodedToken.id;
        const userService: UserService = new UserService();
        //need to check if we already check user why we are checking every time user
        const dbUser: UserModel | null = await userService.getUserByUserId(userId);
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

  private static _handleEvents(socket: Socket): void {
    const socketEventHandler: SocketEventHandler = new SocketEventHandler();

    socket.on('event', async (socketRequest: SocketRequest): Promise<void> => {
      try {
        //handle all events
        await this._processEvents(socketRequest);
      } catch (error) {
        const customError: CustomError = CustomError.getCustomErrorObject(error);
        this.emitErrorEvent(socket.id, customError);
      }
    });

    //handle disconnect event
    socket.on(SocketEventEnum.Disconnect, async (): Promise<void> => {
      try {
        const socketId: string = socket.id;
        await socketEventHandler.processDisconnectEvent(socketId);
      } catch (error) {
        const customError: CustomError = CustomError.getCustomErrorObject(error);
        this.emitErrorEvent(socket.id, customError);
      }
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

  private static _checkAndVerifyToken(token?: string): JWT_OBJECT {
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

  private static async _processEvents(socketRequest: SocketRequest): Promise<void> {
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
      //if user remove through the itself the we call this event
      case SocketEventEnum.LeaveGroup: {
        await socketEventHandler.processLeaveGroupEvent(socketRequest.data as UserLeaveGroupEventRequest);
        break;
      }
      //if admin remove user from group then we call this event
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
      case SocketEventEnum.DeleteMessage: {
        await socketEventHandler.processDeleteMessageEvent(socketRequest.data as DeleteMessageSenderEventRequest);
        break;
      }
    }
  }
}
