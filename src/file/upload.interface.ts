import { Document } from 'mongoose';

export interface IUpload {
  id?: string;          // mongoId
  uploadID: string;
  key: string;
  bucket: string;
  createdAt?: Date;
  updatedAt?: Date;
}
