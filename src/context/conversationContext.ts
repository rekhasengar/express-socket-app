import ConversationService from '@service/v2/conversationService';
import ConversationController from '@src/controllers/v2/conversationController';

export default class ConversationContext {
  public static get getConversationController(): ConversationController {
    const conversationService = new ConversationService();
    return new ConversationController(conversationService);
  }
}
