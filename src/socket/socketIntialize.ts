import { Server, Socket } from 'socket.io';

import EventEnum from '@src/enums/eventEnum';

function joinChatEvent(socket: Socket) {
  socket.on(EventEnum.JOIN_CONVERSATION_EVENT, (chatId) => {
    console.log(`User joined the chat with this chatId: ${chatId}`);
    socket.join(chatId);
  });
}

export function initializeSocketIO(io: Server): Server {
  return io.on('connection', async (socket: Socket) => {
    try {
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

export function emitSocketEvent(io: Server, roomId: string, event: EventEnum, payload: any): void {
  io.in(roomId).emit(event, payload);
}
