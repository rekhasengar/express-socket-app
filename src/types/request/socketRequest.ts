import { MessageStatusEnum } from '@src/enums/messageStatusEnum';
import SocketEventEnum from '@src/enums/socketEventEnum';
import UserStatusEnum from '@src/enums/userStatusEnum';

export type SocketRequest = {
  eventType: SocketEventEnum;
  socketId: string;
  data: EventRequest;
};

export type EventRequest =
  | SendMessageEventRequest
  | ReceiveMessageEventRequest
  | DeleteMessageSenderEventRequest
  | DeleteMessageReceiverEventRequest
  | UserStatusEventRequest
  | AddUsersInGroupEventRequest
  | ChatJoinedEventRequest
  | UserLeaveGroupEventRequest
  | UserLeftGroupEventRequest
  | AdminUpdateRoleEventRequest
  | AdminRenameGroupEventRequest
  | RemoveUserFromGroupEventRequest
  | UserRemovedFromGroupEventRequest
  | SocketErrorEventRequest
  | MessageStatusEventRequest;

export type MessageRequest = {
  id: string;
  message: string;
  timestamp: number;
  timezone: string;
};

//client will send to server.
export type SendMessageEventRequest = {
  senderId: string;
  conversationId: string;
  message: MessageRequest;
};
//server will send to client.
export type ReceiveMessageEventRequest = {
  senderId: string;
  conversationId: string;
  message: MessageRequest;
};

export type MessageStatusEventRequest = {
  conversationId: string;
  userId: string;
  messageId: string;
  status: MessageStatusEnum;
  timestamp: number;
  timezone: string;
};

//client will send to server.
export type DeleteMessageSenderEventRequest = {
  messageId: string;
  userId: string;
  conversationId: string;
};
//server will send to client.
export type DeleteMessageReceiverEventRequest = {
  messageId: string;
  conversationId: string;
};

export type UserStatusEventRequest = {
  userId: string;
  status: UserStatusEnum;
};

// //client will send to server.
export type RemoveUserFromGroupEventRequest = {
  adminId: string;
  userId: string;
  conversationId: string;
};
//server will send to client.
export type UserRemovedFromGroupEventRequest = {
  adminId: string;
  userId: string;
  conversationId: string;
};

//client will send to server.
export type AddUsersInGroupEventRequest = {
  adminId: string;
  conversationId: string;
  userIds: string[];
};

export type ChatJoinedEventRequest = {
  conversationId: string;
};

//client will send to server.
export type UserLeaveGroupEventRequest = {
  conversationId: string;
  userId: string;
};
//Server will send to client.
export type UserLeftGroupEventRequest = {
  conversationId: string;
  userId: string; //who left group.
};

//client side
export type AdminUpdateRoleEventRequest = {
  adminId: string;
  userId: string;
  roleId: string;
  conversationId: string;
};

export type AdminRenameGroupEventRequest = {
  adminId: string;
  conversationId: string;
  groupName: string;
};

export type SocketErrorRequest = {
  name: string;
  status: number;
  message: string;
  errors: string[] | undefined;
};

export type SocketErrorEventRequest = {
  error: SocketErrorRequest;
};
