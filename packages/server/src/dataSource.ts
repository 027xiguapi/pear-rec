import 'reflect-metadata';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Record } from './entity/Record';
import { Setting } from './entity/Setting';
import { DB_PATH } from './contract';

const fileDir = dirname(DB_PATH);
if (!fs.existsSync(fileDir)) {
  fs.mkdirSync(fileDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: 'sqljs',
  location: DB_PATH,
  entities: [User, Record, Setting],
  synchronize: true,
  logging: false,
});
