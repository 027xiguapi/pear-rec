// Record.ts
export interface Record {
  id?: number;

  filePath?: string;

  fileData: any;

  fileName: string;

  fileType: string;

  mark?: string;

  userId: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}
