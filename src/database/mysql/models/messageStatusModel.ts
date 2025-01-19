import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ModelTemplate } from './modelTemplate';
import { UserModel } from './userModel';
import { MessageModel } from './messageModel';
import { MessageStatusEnum } from '../../../enums/messageStatusEnum';

@Entity({ name: 'messageStatuses' })
export class MessageStatusModel extends ModelTemplate {
  @ManyToOne(() => MessageModel, (message) => message.messageStatuses)
  @JoinColumn({ name: 'messageKey', referencedColumnName: 'key' })
  public message: MessageModel;

  @Column('int', { name: 'messageKey' })
  public messageKey: number;

  @Column('varchar')
  public status: MessageStatusEnum;

  @Column('bigint')
  public timestamp: number;

  @Column('varchar')
  public timezone: string;

  @ManyToOne(() => UserModel, (user) => user.messageStatuses)
  @JoinColumn({ name: 'userKey', referencedColumnName: 'key' })
  public user: UserModel;

  @Column('int', { name: 'userKey' })
  public userKey: number;
}
