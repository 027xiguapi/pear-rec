export interface ISetting {
  id: number;

  isProxy: boolean;

  proxyPort: number;

  language: string;

  filePath: string;

  openAtLogin: boolean;

  serverPath: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;
}
