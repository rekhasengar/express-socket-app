import { DefaultEventsMap, Server, Socket } from 'socket.io';

import EventEnum from '@src/enums/eventEnum';

function joinChatEvent(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
  socket.on(EventEnum.JOIN_CONVERSATION_EVENT, (chatId) => {
    console.log(`User joined the chat with this chatId: ${chatId}`);
    socket.join(chatId);
  });
}

let ioInstance: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
export function initializeSocketIO(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  ioInstance = io;
  return io.on('connection', async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    try {
      console.log('SocketId ====>>>', socket.id);

      socket.join(socket.id);
      socket.emit(EventEnum.CONNECTED_EVENT, 'hello');

      joinChatEvent(socket);
      socket.on(EventEnum.DISCONNECT_EVENT, () => {
        console.log('user has disconnected for this userId:', socket.data.user._id);
        if (socket.data.user?._id) {
          socket.leave(socket.data.user._id);
        }
      });
    } catch (error) {
      socket.emit(
        EventEnum.SOCKET_ERROR_EVENT,
        error instanceof Error ? error?.message : 'Something went wrong connection with socket..',
      );
    }
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function emitSocketEvent(roomId: string, event: EventEnum, payload: any): void {
  if (!ioInstance) {
    console.error('Socket.IO instance not initialized');
  }
  if (roomId) {
    ioInstance.to(roomId).emit(event, payload);
  } else {
    ioInstance.emit(event, payload);
  }
}
