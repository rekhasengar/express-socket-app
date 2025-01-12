import { Server, Socket } from 'socket.io';

import { validateJwtToken } from '@src/utils/jwt';
import SocketEventEnum from '@src/enums/socketEventEnum';
import UserService from '@service/v2/userService';
import SocketService from '@service/v2/socketService';
import { EventRequest, SendMessageEventRequest, SocketRequest } from '@src/types/request/socketRequest';
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
        const dbUser = await userService.getUserById(userId as string);
        if (!dbUser) {
          throw new Error('User not found.');
        }

        //storing socket connection details.
        const socketService = new SocketService();
        await socketService.createSocketModel(socket.id, dbUser.key);

        // Handle events
        this._handleEvents(socket, socketService);

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

  private static _handleEvents(socket: Socket, socketService: SocketService) {
    socket.on('event', async (socketRequest: SocketRequest) => {
      this._processEvents(socketRequest);
    });

    socket.on(SocketEventEnum.Disconnect, async () => {
      const socketId: string = socket.id;
      await socketService.removeSocket(socketId);
    });
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
    }
  }

  public static emitEvent(socketId: string, eventType: SocketEventEnum, eventRequest: EventRequest): void {
    this._io.to(socketId).emit(eventType, eventRequest);
  }
}
