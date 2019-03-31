import { Document } from 'mongoose';

export interface IFile {
  id?: string;
  key?: string;
  displayName?: string;
  fullExtension?: string;
  fullName: string;
  type: string;
  description?: string;
  ownerID: string;
  size?: number;
  parent?: IFile | string;
  ancestors?: IFile[] | string[];
  children?: IFile[] | string[];
  isRootFolder?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
