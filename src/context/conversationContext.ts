import ConversationMemberService from '@service/v2/conversationMemberService';
import ConversationService from '@service/v2/conversationService';
import UserService from '@service/v2/userService';
import ConversationController from '@src/controllers/v2/conversationController';
import ConversationMemberRepository from '@src/repositories/v2/conversationMemberRepository';
import ConversationRepository from '@src/repositories/v2/conversationRepository';
import UserRepository from '@src/repositories/v2/userRepository';

export default class ConversationContext {
  public static get getConversationController(): ConversationController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const conversationRepository = new ConversationRepository();
    const conversationMemberRepository = new ConversationMemberRepository();
    const conversationMemberService = new ConversationMemberService(conversationMemberRepository);
    const conversationService = new ConversationService(userService, conversationRepository, conversationMemberService);
    return new ConversationController(conversationService);
  }
}
