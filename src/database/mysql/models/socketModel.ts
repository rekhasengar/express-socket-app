import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ModelTemplate } from './modelTemplate';
import { UserModel } from './userModel';

@Entity({ name: 'socket' })
export class SocketModel extends ModelTemplate {
  @Column('varchar')
  @Index({ unique: true })
  public socketId: string;

  @ManyToOne(() => UserModel, (user) => user.sockets)
  @JoinColumn({ name: 'userKey', referencedColumnName: 'key' })
  public user: UserModel;

  @Column('int')
  public userKey: number;
}
