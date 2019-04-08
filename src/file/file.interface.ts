import { Document } from 'mongoose';
import { IUser } from '../utils/user.interface';

export interface IFile {
  id?: string;
  key?: string;
  bucket?: string;
  displayName?: string;
  fullExtension?: string;
  fullName: string;
  type: string;
  description?: string;
  ownerID: string;
  owner?: IUser;
  size?: number;
  parent?: IFile | string;
  ancestors?: IFile[] | string[];
  children?: IFile[] | string[];
  isRootFolder?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
