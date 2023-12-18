import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { IUser } from '../../users/interfaces/user.interface';
// import { IRecord } from '../interfaces/record.interface';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  filePath: string;

  @Column('varchar', { nullable: true })
  fileType: string;

  @Column('varchar', { nullable: true })
  mark?: string;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @Column('int', { nullable: true })
  createdBy?: number;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column('int', { nullable: true })
  updatedBy?: number;

  @ManyToOne(() => User, (user) => user.records)
  user: IUser;
}
