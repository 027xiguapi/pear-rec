import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { IUser } from '../../users/interfaces/user.interface';
import { ISetting } from '../interfaces/setting.interface';

@Entity()
export class Setting implements ISetting {
  @PrimaryGeneratedColumn()
  id: number;

  // 是否代理
  @Column('boolean', { nullable: true })
  isProxy: boolean;

  // 代理端口
  @Column('varchar', { nullable: true })
  proxyPort: number;

  // 语言
  @Column('varchar', { nullable: true })
  language: string;

  // 文件保存地址
  @Column('varchar', { nullable: true })
  filePath: string;

  // 开机自启动
  @Column('boolean', { nullable: true })
  openAtLogin: boolean;

  // 服务器地址
  @Column('varchar', { nullable: true })
  serverPath: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @Column('varchar', { nullable: true })
  createdBy: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column('varchar', { nullable: true })
  updatedBy: string;

  @OneToOne(() => User, (user) => user.setting)
  @JoinColumn()
  user: IUser;
}
