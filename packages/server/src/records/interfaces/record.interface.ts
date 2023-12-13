import { IUser } from '../../users/interfaces/user.interface';

export interface IRecord {
  id: number;

  filePath: string;

  fileType: string;

  mark: string;

  user: IUser;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;
}
