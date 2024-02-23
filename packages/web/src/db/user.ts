// User.ts
import { v5 as uuidv5 } from 'uuid';

export interface User {
  id?: number;

  uuid: string;

  userName: string;

  userType: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}

export const defaultUser = {
  uuid: uuidv5('https://www.w3.org/', uuidv5.URL),
  userName: `pear-rec:user`,
  userType: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
