import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ModelTemplate } from './modelTemplate';
import { UserModel } from './userModel';
import { ConversationModel } from './conversationModel';
import { RoleModel } from './roleModel';

@Entity({ name: 'conversationMembers' })
export class ConversationMemberModel extends ModelTemplate {
  @ManyToOne(() => UserModel, (user) => user.conversationMembers)
  @JoinColumn({ name: 'userKey', referencedColumnName: 'key' })
  public user: UserModel;

  @Column('int')
  public userKey: number;

  @ManyToOne(() => ConversationModel, (conversation) => conversation.members)
  @JoinColumn({ name: 'conversationKey', referencedColumnName: 'key' })
  public conversation: ConversationModel;

  @Column('int')
  public conversationKey: number;

  @ManyToOne(() => RoleModel, (role) => role.conversationMembers)
  @JoinColumn({ name: 'roleKey', referencedColumnName: 'key' })
  public role: RoleModel;

  @Column('int')
  public roleKey: number;
}
