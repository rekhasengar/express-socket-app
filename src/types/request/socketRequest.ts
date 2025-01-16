import SocketEventEnum from '@src/enums/socketEventEnum';
import UserStatusEnum from '@src/enums/userStatusEnum';

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
  | AddUsersInGroupEventRequest
  | UsersAddedInGroupEventRequest
  | UserLeaveGroupEventRequest
  | UserLeftGroupEventRequest
  | AdminUpdateRoleEventRequest
  | AdminRenameGroupEventRequest
  | RemoveUserFromGroupEventRequest
  | UserRemovedFromGroupEventRequest;

export type MessageRequest = {
  id: string;
  message: string;
  timestamp: number;
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
  memberIds: string[];
};
//server will send to client.
export type UsersAddedInGroupEventRequest = {
  adminId: string;
  conversationId: string;
  memberIds: string[];
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

export type AdminUpdateRoleEventRequest = {
  adminId: string;
  memberId: string;
  roleId: string;
  conversationId: string;
};

export type AdminRenameGroupEventRequest = {
  adminId: string;
  conversationId: string;
  groupName: string;
};
