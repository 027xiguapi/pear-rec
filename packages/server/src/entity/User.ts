import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { Record } from "./Record";

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

	// 是否代理
	@Column("varchar", { nullable: true })
	isProxy!: boolean;

	// 代理端口
	@Column("integer", { nullable: true })
	proxyPort: number;

	// 语言
	@Column("varchar", { nullable: true })
	language: string;

	// 文件保存地址
	@Column("varchar", { nullable: true })
	filePath: string;

	// 开机自启动
	@Column("varchar", { nullable: true })
	openAtLogin: boolean;

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
}
