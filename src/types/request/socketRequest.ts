import SocketEventEnum from '@src/enums/socketEventEnum';

export type SocketRequest = {
  eventType: SocketEventEnum;
  data: EventRequest;
};

export type EventRequest =
  | SendMessageEventRequest
  | ReceiveMessageEventRequest
  | DeleteMessageSenderEventRequest
  | DeleteMessageReceiverEventRequest
  | UserStatusEventRequest
  | RemoveUserFromGroup
  | UserRemovedFromGroup
  | AddUsersInGroup
  | UsersAddedInGroup
  | UserLeaveGroup
  | UserLeftGroup
  | AdminUpdateRole;

export type MessageRequest = {
  id: string;
  message: string;
  timestamp: number;
};

export type SendMessageEventRequest = {
  userId: string;
  conversationId: string;
  message: MessageRequest;
};

export type ReceiveMessageEventRequest = {
  senderId: string;
  conversationId: string;
  message: MessageRequest;
};

export type DeleteMessageSenderEventRequest = {
  messageId: string;
  userId: string;
  conversationId: string;
};

export type DeleteMessageReceiverEventRequest = {
  messageId: string;
  conversationId: string;
};

export type UserStatusEventRequest = {
  userId: string;
};

//client will send to server.
export type RemoveUserFromGroup = {
  adminId: string;
  userId: string;
  conversationId: string;
};

//server will send to client.
export type UserRemovedFromGroup = {
  adminId: string;
  userId: string;
  conversationId: string;
};

//client will send to server.
export type AddUsersInGroup = {
  adminId: string;
  conversationId: string;
  memberIds: string[];
};

//server will send to client.
export type UsersAddedInGroup = {
  adminId: string;
  conversationId: string;
  memberIds: string[];
};

//client will send to server.
export type UserLeaveGroup = {
  conversationId: string;
  userId: string;
};

//Server will send to client.
export type UserLeftGroup = {
  conversationId: string;
  userId: string; //who left group.
};

export type AdminUpdateRole = {
  adminId: string;
  memberId: string;
  roleId: string;
};
