import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Record } from '../../records/entity/record.entity';
import { Setting } from '../../settings/entity/setting.entity';
// import { IRecord } from '../model/IRecord';
// import { ISetting } from '../model/ISetting';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  // uuid 页面id
  @Column('varchar')
  uuid: string;

  // 用户名
  @Column('varchar')
  userName: string;

  // 用户类型：1. 本机用户
  @Column('varchar')
  userType: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @Column('varchar', { nullable: true })
  createdBy: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column('varchar', { nullable: true })
  updatedBy: string;

  // @OneToMany(() => Record, (record) => record.user)
  // records: Record[];

  // @OneToOne(() => Setting, (setting) => setting.user)
  // setting: Setting;
}
