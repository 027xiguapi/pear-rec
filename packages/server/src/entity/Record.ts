import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Record {
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
