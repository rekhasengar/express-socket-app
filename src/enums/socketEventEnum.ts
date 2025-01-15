enum SocketEventEnum {
  // Connection-related events
  Connected = 'connected',
  Disconnect = 'disconnect',
  SocketError = 'socketError',

  // Message-related events
  SendMessage = 'sendMessage',
  ReceiveMessage = 'receiveMessage',

  //User activity related events
  UserStatus = 'userStatus',

  //Conversation related event
  RemoveUserFromGroup = 'removeUserFromGroup',
  LeaveGroup = 'leaveGroup',

  RenameGroup = 'renameGroup',

  UpdateUserRoleInGroup = 'updateUserRoleInGroup',

  // Chat and group events
  AddUserInGroup = 'addUserInGroup',
  JoinChat = 'joinChat',
}

export default SocketEventEnum;
