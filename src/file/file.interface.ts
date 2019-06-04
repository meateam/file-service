import { IUser } from '../utils/user.interface';

export interface IFile {
  id?: string;
  key?: string;
  bucket?: string;
  name: string;
  displayName?: string;
  fullExtension?: string;
  type: string;
  description?: string;
  ownerID: string;
  owner?: IUser;
  size?: number;
  parent?: IFile | string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
