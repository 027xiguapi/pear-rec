// Setting.ts
export interface Setting {
  id?: number;

  isProxy: boolean;

  proxyPort: string;

  language: string;

  filePath: string | FileSystemDirectoryHandle;

  openAtLogin: boolean;

  openServer: boolean;

  serverPath: string;

  userId: number;

  createdAt?: Date;

  createdBy?: string;

  updatedAt?: Date;

  updatedBy?: string;
}

export const defaultSetting = {
  isProxy: false,
  proxyPort: '7890',
  language: 'zh',
  filePath: '',
  openAtLogin: false,
  openServer: false,
  serverPath: 'http://localhost:9190/',
  createdAt: new Date(),
  updatedAt: new Date(),
};
