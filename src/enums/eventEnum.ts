enum EventEnum {
  CONNECTED_EVENT = 'connected',
  DISCONNECT_EVENT = 'disconnect',
  JOIN_CONVERSATION_EVENT = 'joinConversation',
  NEW_CONVERSATION_EVENT = 'newConversation',
  MESSAGE_RECEIVED_EVENT = 'messageReceived',
  LEAVE_CONVERSATION_EVENT = 'leaveConversation',
  UPDATE_GROUP_NAME_EVENT = 'updateGroupName',
  MESSAGE_DELETE_EVENT = 'messageDeleted',
  REGISTER_EVENT = '',
  CREATE_CONVERSATION = '',
  ADD_USER = '',
  SOCKET_ERROR_EVENT = 'socketError',
}

export default EventEnum;
