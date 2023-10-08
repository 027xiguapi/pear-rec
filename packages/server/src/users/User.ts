import {
	Model,
	AutoIncrement,
	PrimaryKey,
	CreatedAt,
	UpdatedAt,
	Table,
	Column,
	HasMany,
} from "sequelize-typescript";

import { History } from "../historys/History";

@Table
export class User extends Model {
	// 主键
	@AutoIncrement
	@PrimaryKey
	@Column
	id: number;
	// uuid 页面id
	@Column uuid!: string;
	// 用户名
	@Column userName!: string;
	// 用户类型：1. 本机用户
	@Column userType!: string;
	// 是否代理
	@Column isProxy!: boolean;
	// 代理端口
	@Column proxyPort!: number;
	// 语言
	@Column language!: string;
	// 文件保存地址
	@Column filePath!: string;
	// 开机自启动
	@Column openAtLogin!: boolean;
	// 历史图片
	@Column historyImg!: string;
	// 历史视频
	@Column historyVideo!: string;
	// 历史音频
	@Column historyAudio!: string;
	// 创建时间
	@CreatedAt createdAt: Date;
	// 创建者
	@Column createdBy!: string;
	// 更新时间
	@UpdatedAt updatedAt: Date;
	// 更新者
	@Column updatedBy!: string;
	@HasMany(() => History) historys: History[];
}
