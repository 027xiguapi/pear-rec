import { homedir } from 'node:os';
import path from 'node:path';

process.env.DIST_ELECTRON = path.join(__dirname, '../');
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist');

export const url = import.meta.env.VITE_DEV_SERVER_URL;
export const WEB_URL = import.meta.env.VITE_WEB_URL;
export const VITE_API_URL = import.meta.env.VITE_API_URL;
// export const url = 'http://127.0.0.1:7777/';
// export const WEB_URL = 'http://127.0.0.1:9191/';
// export const VITE_API_URL = 'http://127.0.0.1:9190/';
export const preload = path.join(__dirname, '../preload/index.js');
export const serverPath = path.join(__dirname, '../server/main.js');
export const DIST_ELECTRON = path.join(__dirname, '../');
export const DIST = path.join(DIST_ELECTRON, '../dist');

export const PUBLIC = url ? path.join(DIST_ELECTRON, '../public') : process.env.DIST;
export const ICON = url
  ? path.join(PUBLIC, './imgs/logo/favicon.ico')
  : path.join(DIST, './imgs/logo/favicon.ico');
export const PEAR_FILES = path.join(DIST_ELECTRON, `../Pear Files`);

export const DOCS_PATH = path.join(homedir(), 'Documents');

export const filePath = path.join(DOCS_PATH, `Pear Files`);

export const PEAR_FILES_PATH = path.join(DOCS_PATH, 'Pear Files');

export const CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `config.json`);

export const DEFAULT_CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `default-config.json`);

export const DB_PATH = path.join(PEAR_FILES_PATH, 'db/pear-rec.db');

export const LOG_PATH = path.join(PEAR_FILES_PATH, 'log');
