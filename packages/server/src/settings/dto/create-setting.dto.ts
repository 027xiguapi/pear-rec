import { IUser } from '../../users/interfaces/user.interface';

export class CreateSettingDto {
  id: number;

  isProxy: boolean;

  proxyPort: number;

  language: string;

  filePath: string;

  openAtLogin: boolean;

  serverPath: string;

  user: IUser;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;
}
