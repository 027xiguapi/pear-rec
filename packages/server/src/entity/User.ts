import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	OneToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { Record } from "./Record";
import { Setting } from "./Setting";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	// uuid 页面id
	@Column("varchar")
	uuid!: string;

	// 用户名
	@Column("varchar")
	userName!: string;

	// 用户类型：1. 本机用户
	@Column("varchar")
	userType: string;

	@CreateDateColumn({ nullable: true })
	createdAt: Date;

	@Column("varchar", { nullable: true })
	createdBy: string;

	@UpdateDateColumn({ nullable: true })
	updatedAt: Date;

	@Column("varchar", { nullable: true })
	updatedBy: string;

	@OneToMany(() => Record, (record) => record.user)
	records: Record[];

	@OneToOne(() => Setting, (setting) => setting.user)
	setting: Setting;
}
