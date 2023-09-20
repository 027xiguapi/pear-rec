import {
	Model,
	Table,
	Column,
	ForeignKey,
	BelongsTo,
	CreatedAt,
	UpdatedAt,
	AutoIncrement,
	PrimaryKey,
} from "sequelize-typescript";

import { User } from "../users/User";

@Table
export class History extends Model {
	@AutoIncrement
	@PrimaryKey
	@Column
	id: number;
	@Column filePath!: string;
	@Column fileType!: string;
	@Column mark!: string;
	@CreatedAt createdAt: Date;
	@Column createdBy!: string;
	@UpdatedAt updatedAt: Date;
	@Column updatedBy!: string;
	@ForeignKey(() => User) @Column userId!: number;
	@BelongsTo(() => User) user: User;
}
