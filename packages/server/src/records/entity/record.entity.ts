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
  user: IUser;
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

  @Column('varchar', { nullable: true })
  createdBy?: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column('varchar', { nullable: true })
  updatedBy?: string;

  // @ManyToOne(() => User, (user) => user.records)
  // user: IUser;
}
