import { ISetting } from '../../settings/interfaces/setting.interface';
import { IRecord } from '../../records/interfaces/record.interface';

export interface IUser {
  id: number;

  uuid: string;

  userName: string;

  userType: string;

  // records: IRecord[];

  // setting: ISetting;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;
}
