import { Column, CreateDateColumn, Generated, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class ModelTemplate {
  @PrimaryGeneratedColumn('increment')
  public key: number;

  @Index({ unique: true })
  @Column('uuid')
  @Generated('uuid')
  public id: string;

  @CreateDateColumn()
  public createAt: Date;

  @UpdateDateColumn()
  public updateAt: Date;

  @Column('boolean', { default: false })
  public deleted: boolean;
}
