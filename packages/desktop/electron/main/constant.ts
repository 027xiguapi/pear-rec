import { homedir } from 'node:os';
import path from 'node:path';

process.env.DIST_ELECTRON = path.join(__dirname, '../');
process.env.DIST = path.join(process.env.DIST_ELECTRON, '../dist');

export const isMac = process.platform === 'darwin';
export const isLinux = process.platform == 'linux';
export const isWin = process.platform == 'win32';

export const url = import.meta.env.VITE_DEV_SERVER_URL;
export const WEB_URL = import.meta.env.VITE_WEB_URL;
export const VITE_API_URL = import.meta.env.VITE_API_URL;

export const preload = path.join(__dirname, '../preload/index.js');
export const serverPath = path.join(__dirname, '../server/main.js');
export const DIST_ELECTRON = path.join(__dirname, '../');
export const DIST = path.join(DIST_ELECTRON, '../dist');

export const PUBLIC = url ? path.join(DIST_ELECTRON, '../public') : process.env.DIST;

export const ICON = path.join(PUBLIC, './imgs/icons/png/32x32.png');

export const DOCS_PATH = path.join(homedir(), 'Documents');

export const PEAR_FILES_PATH = path.join(DOCS_PATH, 'Pear Files');

export const CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `config.json`);

export const DEFAULT_CONFIG_FILE_PATH = path.join(PEAR_FILES_PATH, `default-config.json`);

export const DB_PATH = path.join(PEAR_FILES_PATH, 'db/pear-rec.db');

export const LOG_PATH = path.join(PEAR_FILES_PATH, 'log');
