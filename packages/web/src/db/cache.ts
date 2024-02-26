// Cache.ts
export interface Cache {
  id?: number;

  fileData: any;

  fileName: string;

  fileType: string;

  frameDuration: number;

  userId: number;

  createdAt?: Date;

  createdBy?: number;

  updatedAt?: Date;

  updatedBy?: number;
}
