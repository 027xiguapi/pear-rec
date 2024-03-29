import Dexie, { Table } from 'dexie';
import { Cache } from './cache';
import { Record } from './record';
import { Setting, defaultSetting } from './setting';
import { Shortcut, defaultShortcut } from './shortcut';
import { User, defaultUser } from './user';

export class MySubClassedDexie extends Dexie {
  users!: Table<User>;
  records!: Table<Record>;
  settings!: Table<Setting>;
  caches!: Table<Cache>;
  shortcuts!: Table<Shortcut>;

  constructor() {
    super('pear-rec:database');
    this.version(2).stores({
      users: '++id, uuid, userName, userType, createdAt, createdBy, updatedAt, updatedBy',
      records:
        '++id, filePath, fileData, fileType, fileName, mark, userId, createdAt, createdBy, updatedAt, updatedBy',
      caches:
        '++id, fileData, fileType, duration, userId, createdAt, createdBy, updatedAt, updatedBy',
      settings:
        '++id, isProxy, proxyPort, language, filePath, openServer, openAtLogin, serverPath, userId, createdAt, createdBy, updatedAt, updatedBy',
      shortcuts:
        '++id, screenshot, videoRecording, screenRecording, audioRecording, userId, createdAt, createdBy, updatedAt, updatedBy',
    });
  }
}

export const db = new MySubClassedDexie();

export { defaultSetting, defaultUser, defaultShortcut };
