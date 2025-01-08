import { Column, Entity, OneToMany } from 'typeorm';

import { MessageModel } from './messageModel';
import { ModelTemplate } from './modelTemplate';
import { ConversationMemberModel } from './conversationMemberModel';

@Entity({ name: 'users' })
export class UserModel extends ModelTemplate {
  @Column('varchar')
  public firstName: string;

  @Column('varchar', { nullable: true })
  public lastName: string | null;

  @Column('varchar', { unique: true })
  public email: string;

  @Column('varchar', { nullable: true })
  public password: string | null;

  @Column('bit', { default: false })
  public isVerified: boolean;

  @Column('text', { nullable: true })
  public resetPasswordToken: string | null;

  @Column('text', { nullable: true })
  public refreshToken: string | null;

  @Column('text', { nullable: true })
  public emailVerificationToken: string | null;

  @Column('bit')
  public isLoginEnabled: boolean;

  @OneToMany(() => ConversationMemberModel, (conversationMember) => conversationMember.user)
  public conversationMembers: ConversationMemberModel[];

  @OneToMany(() => MessageModel, (message) => message.sender)
  public messages: MessageModel[];
}
