enum SocketEventEnum {
  // Connection-related events
  Connected = 'connected',
  Disconnect = 'disconnect',
  SocketError = 'socketError',

  // Message-related events
  SendMessage = 'sendMessage',
  ReceiveMessage = 'receiveMessage',
  DeleteMessage = 'deleteMessage',

  //User activity related events
  ActiveUser = 'activeUser',
  InactiveUser = 'inactiveUser',

  //Conversation related event
  RemoveUserFromGroup = 'removeUserFromGroup',
  AddUserInGroup = 'addUserInGroup',
  LeaveGroup = 'leaveGroup',
  UpdateGroupUserRole = 'updateGroupUserRole',

  // Chat and group events - pending.
  JoinChat = 'joinChat',
  RenameGroup = 'renameGroup',
  NewConversationCreate = 'newConversationCreate',
}

export default SocketEventEnum;
