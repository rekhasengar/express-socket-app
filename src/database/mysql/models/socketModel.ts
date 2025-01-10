import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { ModelTemplate } from './modelTemplate';
import { UserModel } from './userModel';
import { ConversationModel } from './conversationModel';

@Entity({ name: 'socket' })
export class SocketModel extends ModelTemplate {
  @Column('varchar')
  public socketId: string;

  @OneToOne(() => UserModel, (user) => user.socket)
  @JoinColumn({ name: 'userKey', referencedColumnName: 'key' })
  public user: UserModel;

  @Column('int')
  public userKey: number;

  @ManyToOne(() => ConversationModel, (conversation) => conversation.socket)
  @JoinColumn({ name: 'conversationKey', referencedColumnName: 'key' })
  public conversation: ConversationModel;

  @Column('int')
  public conversationKey: number;
}
