import { Server, Socket } from 'socket.io';

import { validateJwtToken } from '@src/utils/jwt';
import SocketEventEnum from '@src/enums/socketEventEnum';
import UserService from '@service/v2/userService';
import SocketService from '@service/v2/socketService';
import {
  AddUsersInGroupEventRequest,
  AdminRenameGroupEventRequest,
  EventRequest,
  RemoveUserFromGroupEventRequest,
  SendMessageEventRequest,
  SocketRequest,
  UserLeaveGroupEventRequest,
} from '@src/types/request/socketRequest';
import SocketEventHandler from './socketEventHandler';

export default class SocketConnector {
  private static _io: Server;

  public static async initialize(io: Server): Promise<void> {
    this._io = io;
    io.on('connection', async (socket: Socket) => {
      try {
        const decodedToken = this._checkAndVerifyToken(socket.handshake.auth.token);
        const userId = decodedToken.id;
        const userService = new UserService();
        const dbUser = await userService.getUserByUserId(userId as string);
        if (!dbUser) {
          throw new Error('User not found.');
        }

        //storing socket connection details.
        const socketService = new SocketService();
        await socketService.createSocketModel(socket.id, dbUser.key);
        // Handle events
        this._handleEvents(socket);

        // Emit connected event
        this._io.to(socket.id).emit(SocketEventEnum.Connected);
      } catch (error) {
        socket.emit(
          SocketEventEnum.SocketError,
          error instanceof Error ? error?.message : 'Something went wrong connection with socket..',
        );
      }
    });
  }

  private static _handleEvents(socket: Socket) {
    const socketEventHandler = new SocketEventHandler();

    socket.on('event', async (socketRequest: SocketRequest) => {
      this._processEvents(socketRequest);
    });

    socket.on(SocketEventEnum.Disconnect, async () => {
      const socketId: string = socket.id;
      await socketEventHandler.processDisconnectEvent(socketId);
    });
  }

  public static emitEvent(socketId: string, eventType: SocketEventEnum, eventRequest: EventRequest): void {
    this._io.to(socketId).emit(eventType, eventRequest);
  }

  private static _checkAndVerifyToken(token?: string) {
    if (!token) {
      throw new Error('Token Missing.');
    }

    //decoding token.
    const decodedToken = validateJwtToken(token);
    if (!decodedToken) {
      throw new Error('Invalid token.');
    }
    return decodedToken;
  }

  private static _processEvents(socketRequest: SocketRequest) {
    const socketEventHandler = new SocketEventHandler();
    switch (socketRequest.eventType) {
      case SocketEventEnum.SendMessage: {
        socketEventHandler.processSendMessageEvent(socketRequest.data as SendMessageEventRequest);
        break;
      }
      case SocketEventEnum.AddUserInGroup: {
        socketEventHandler.processAddUsersInGroupEvent(socketRequest.data as AddUsersInGroupEventRequest);
        break;
      }
      case SocketEventEnum.LeaveGroup: {
        socketEventHandler.processLeaveGroupEvent(socketRequest.data as UserLeaveGroupEventRequest);
        break;
      }
      case SocketEventEnum.RemoveUserFromGroup: {
        socketEventHandler.processRemoveUserFromGroupEvent(socketRequest.data as RemoveUserFromGroupEventRequest);
        break;
      }
      case SocketEventEnum.RenameGroup: {
        socketEventHandler.processAdminRenameGroupEvent(socketRequest.data as AdminRenameGroupEventRequest);
        break;
      }
      case SocketEventEnum.UpdateUserRoleInGroup: {
        // socketEventHandler.processUpdateUserRoleInGroupEvent(socketRequest.data as AdminUpdateRoleEventRequest);
        break;
      }
    }
  }
}
