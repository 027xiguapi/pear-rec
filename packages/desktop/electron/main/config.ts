import jsonfile from 'jsonfile';
import * as fs from 'node:fs';
import { v5 as uuidv5 } from 'uuid';
import dayjs from 'dayjs';
import { PEAR_FILES_PATH, CONFIG_FILE_PATH, DEFAULT_CONFIG_FILE_PATH } from './contract';

export function initConfig() {
  if (!fs.existsSync(PEAR_FILES_PATH)) {
    fs.mkdirSync(PEAR_FILES_PATH, { recursive: true });
  }
  fs.access(DEFAULT_CONFIG_FILE_PATH, fs.constants.F_OK, (err) => {
    if (err) {
      initDefaultConfig();
      return;
    }
  });
}

function initDefaultConfig() {
  const defaultConfig = {
    user: {
      uuid: uuidv5('https://www.w3.org/', uuidv5.URL),
      userName: `pear-rec:user`,
      userType: 1,
      createdAt: dayjs().format(),
    },
    isProxy: false,
    proxyPort: '7890',
    language: 'zh',
    filePath: PEAR_FILES_PATH,
    openAtLogin: false,
    serverPath: 'http://localhost:9190/',
  };
  jsonfile.writeFileSync(CONFIG_FILE_PATH, defaultConfig, {
    spaces: 2,
    EOL: '\r\n',
  });
  jsonfile.writeFileSync(DEFAULT_CONFIG_FILE_PATH, defaultConfig, {
    spaces: 2,
    EOL: '\r\n',
  });
}

export function getConfig() {
  try {
    let config = jsonfile.readFileSync(CONFIG_FILE_PATH) || {};
    return config;
  } catch (err) {
    console.log('getConfig :', err);
  }
}

export function getDefaultConfig() {
  try {
    let defaultConfig = jsonfile.readFileSync(DEFAULT_CONFIG_FILE_PATH) || {};
    return defaultConfig;
  } catch (err) {
    console.log('getConfig :', err);
  }
}

export function resetConfig() {
  try {
    let defaultConfig = jsonfile.readFileSync(DEFAULT_CONFIG_FILE_PATH) || {};
    jsonfile.writeFileSync(CONFIG_FILE_PATH, defaultConfig, {
      spaces: 2,
      EOL: '\r\n',
    });
    return defaultConfig;
  } catch (err) {
    console.log('getConfig :', err);
  }
}

export function editConfig(key: string, value: any, cb?: Function) {
  try {
    let config = jsonfile.readFileSync(CONFIG_FILE_PATH) || {};
    config[key] = value;
    jsonfile
      .writeFile(CONFIG_FILE_PATH, config, {
        spaces: 2,
        EOL: '\r\n',
      })
      .then(() => {
        cb && cb();
      });
    return config;
  } catch (err) {
    console.log('editConfig :', err);
  }
}

export function editUser(key: string, value: string, cb?: Function) {
  try {
    jsonfile.readFile(CONFIG_FILE_PATH).then((config) => {
      const user = config.user;
      user[key] = value;
      jsonfile.writeFile(CONFIG_FILE_PATH, { user: user }, { spaces: 2, EOL: '\r\n' }).then(() => {
        cb && cb();
      });
    });
  } catch (err) {
    console.log('editUser :', err);
  }
}
