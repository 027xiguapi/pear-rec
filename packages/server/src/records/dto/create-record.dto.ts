import { IUser } from '../../users/interfaces/user.interface';

export class CreateRecordDto {
  filePath: string;

  fileType: string;

  mark?: string;

  user: IUser;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}
