import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { IRecord } from '../model/IRecord';

@Entity()
export class Record implements IRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  filePath: string;

  @Column('varchar', { nullable: true })
  fileType: string;

  @Column('varchar', { nullable: true })
  mark: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @Column('varchar', { nullable: true })
  createdBy: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column('varchar', { nullable: true })
  updatedBy: string;

  @ManyToOne(() => User, (user) => user.records)
  user: User;
}
