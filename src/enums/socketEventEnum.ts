enum SocketEventEnum {
  //Server side event.
  Disconnect = 'disconnect',
  SocketError = 'socketError',
  SendMessage = 'sendMessage',

  //common event.
  MessageStatus = 'messageStatus',
  DeleteMessage = 'deleteMessage', //need to discuss with sir.
  UserStatus = 'userStatus', //need to handle in the backend.
  RemoveUserFromGroup = 'removeUserFromGroup',
  AddUserInGroup = 'addUserInGroup',
  LeaveGroup = 'leaveGroup',
  RenameGroup = 'renameGroup',
  UpdateUserRoleInGroup = 'updateUserRoleInGroup',

  //Client side event.
  Connected = 'connected',
  ReceiveMessage = 'receiveMessage',
  JoinChat = 'joinChat',
}

export default SocketEventEnum;
