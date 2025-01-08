import { SUCCESS_MESSAGE } from '@src/constants';
import UserService from './userService';
import { ConversationResponse } from '@src/types/response/conversationResponse';

export default class ConversationService {
  private readonly _userService: UserService;

  constructor(userService: UserService) {
    this._userService = userService;
  }

  public async getAllActiveUserList(): Promise<ConversationResponse> {
    const users = await this._userService.getAllActiveUsers();
    return {
      message: SUCCESS_MESSAGE.USERS_FETCHED_SUCCESSFULLY,
      body: users,
    };
  }
}
