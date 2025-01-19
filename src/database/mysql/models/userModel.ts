import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { MessageModel } from './messageModel';
import { ModelTemplate } from './modelTemplate';
import { ConversationMemberModel } from './conversationMemberModel';
import { SocketModel } from './socketModel';
import { ConversationModel } from './conversationModel';
import { MessageStatusModel } from './messageStatusModel';

@Entity({ name: 'users' })
export class UserModel extends ModelTemplate {
  @Column('varchar')
  public firstName: string;

  @Column('varchar')
  public lastName: string;

  @Column('varchar', { unique: true })
  public email: string;

  @Column('varchar')
  public password: string;

  @Column('boolean', { default: false })
  public isVerified: boolean;

  @Column('text', { nullable: true })
  public resetPasswordToken: string | null;

  @Column('text', { nullable: true })
  public emailVerificationToken: string | null;

  @Column('boolean', { default: false })
  public isUserLoggedIn: boolean;

  @OneToMany(() => ConversationMemberModel, (conversationMember) => conversationMember.user)
  public conversationMembers: ConversationMemberModel[];

  @OneToMany(() => MessageModel, (message) => message.sender)
  public messages: MessageModel[];

  @OneToMany(() => MessageStatusModel, (messageStatus) => messageStatus.user)
  public messageStatuses: MessageStatusModel[];

  @OneToMany(() => ConversationModel, (conversation) => conversation.createdBy)
  public createdConversations: ConversationModel[];

  @OneToMany(() => SocketModel, (socket) => socket.user)
  public sockets: SocketModel[];

  //it is hook which is execute before insert data in db
  @BeforeInsert()
  @BeforeUpdate()
  public async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
