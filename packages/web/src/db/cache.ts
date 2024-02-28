// Cache.ts
export interface Cache {
  id?: number;

  fileData: any;

  fileName: string;

  fileType: string;

  duration: number;

  userId: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}
