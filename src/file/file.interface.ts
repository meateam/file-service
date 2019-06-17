import { ObjectID } from 'mongodb';

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
  size: number;
  parent?: ObjectID | string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
