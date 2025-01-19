import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { MessageModel } from './messageModel';
import { ModelTemplate } from './modelTemplate';
import { ConversationMemberModel } from './conversationMemberModel';
import { UserModel } from './userModel';

@Entity({ name: 'conversations' })
export class ConversationModel extends ModelTemplate {
  @Column('varchar')
  public name: string;

  @Column('boolean')
  public isGroupChat: boolean;

  @OneToMany(() => ConversationMemberModel, (conversationMember) => conversationMember.conversation)
  public members: ConversationMemberModel[];

  @OneToMany(() => MessageModel, (message) => message.conversation)
  public messages: MessageModel[];

  @ManyToOne(() => UserModel, (user) => user.createdConversations)
  @JoinColumn({ name: 'createdByKey', referencedColumnName: 'key' })
  public createdBy: UserModel;

  @Column('int', { name: 'createdByKey' })
  public createdByKey: number;
}
