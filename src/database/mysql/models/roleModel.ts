import { Column, Entity, OneToMany } from 'typeorm';

import { ModelTemplate } from './modelTemplate';
import { ConversationMemberModel } from './conversationMemberModel';
import RolesEnum from '../../../enums/rolesEnum';

@Entity({ name: 'roles' })
export class RoleModel extends ModelTemplate {
  @OneToMany(() => ConversationMemberModel, (conversationMember) => conversationMember.role)
  public conversationMembers: ConversationMemberModel[];

  @Column('nvarchar')
  public name: RolesEnum;

  @Column('text')
  public description: string;
}
