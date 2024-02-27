import Dexie, { Table } from 'dexie';
import { Cache } from './cache';
import { Record } from './record';
import { Setting, defaultSetting } from './setting';
import { User, defaultUser } from './user';

export class MySubClassedDexie extends Dexie {
  users!: Table<User>;
  records!: Table<Record>;
  settings!: Table<Setting>;
  caches!: Table<Cache>;

  constructor() {
    super('pear-rec:database');
    this.version(1.1).stores({
      users: '++id, uuid, userName, userType, createdAt, createdBy, updatedAt, updatedBy',
      records:
        '++id, filePath, fileData, fileType, fileName, mark, userId, createdAt, createdBy, updatedAt, updatedBy',
      caches:
        '++id, fileData, fileType, frameDuration, userId, createdAt, createdBy, updatedAt, updatedBy',
      settings:
        '++id, isProxy, proxyPort, language, filePath, openServer, openAtLogin, serverPath, userId, createdAt, createdBy, updatedAt, updatedBy',
    });
  }
}

export const db = new MySubClassedDexie();

export { defaultSetting, defaultUser };
