import Dexie, { Table } from 'dexie';
import { Record } from './record';
import { Setting, defaultSetting } from './setting';
import { User, defaultUser } from './user';

export class MySubClassedDexie extends Dexie {
  users!: Table<User>;
  records!: Table<Record>;
  settings!: Table<Setting>;

  constructor() {
    super('pear-rec:database');
    this.version(1).stores({
      users: '++id, uuid, userName, userType, createdAt, createdBy, updatedAt, updatedBy',
      records: '++id, filePath, fileType, mark, userId, createdAt, createdBy, updatedAt, updatedBy',
      settings:
        '++id, isProxy, proxyPort, language, filePath, openAtLogin, serverPath, userId, createdAt, createdBy, updatedAt, updatedBy',
    });
  }
}

export const db = new MySubClassedDexie();

export { defaultSetting, defaultUser };
