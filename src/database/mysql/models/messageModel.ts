import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ConversationModel } from './conversationModel';
import { ModelTemplate } from './modelTemplate';
import { UserModel } from './userModel';
import { MessageStatusModel } from './messageStatusModel';

@Entity({ name: 'messages' })
export class MessageModel extends ModelTemplate {
  @ManyToOne(() => UserModel, (user) => user.messages)
  @JoinColumn({ name: 'senderKey', referencedColumnName: 'key' })
  public sender: UserModel;

  @Column('int', { name: 'senderKey' })
  public senderKey: number;

  @Column('text', { nullable: true })
  public message: string | null;

  @ManyToOne(() => ConversationModel, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversationKey', referencedColumnName: 'key' })
  public conversation: ConversationModel;

  @Column('int', { name: 'conversationKey' })
  public conversationKey: number;

  @OneToMany(() => MessageStatusModel, (messageStatus) => messageStatus.message)
  public messageStatuses: MessageStatusModel[];
}
