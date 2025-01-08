import ConversationService from '@service/v2/conversationService';
import UserService from '@service/v2/userService';
import ConversationController from '@src/controllers/v2/conversationController';
import UserRepository from '@src/repositories/v2/userRepository';

export default class ConversationContext {
  public static get getConversationController(): ConversationController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const conversationService = new ConversationService(userService);
    return new ConversationController(conversationService);
  }
}
