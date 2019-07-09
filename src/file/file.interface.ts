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

// Same as IFile, but changing types accordingly
export class ResFile {
  id: string;
  key: string;
  bucket: string;
  displayName: string;
  fullExtension: string;
  name: string;
  type: string;
  description: string;
  ownerID: string;
  size: number;
  parent: ObjectID | string;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(file: IFile) {
    this.id = file.id;
    this.key = file.key;
    this.bucket = file.bucket;
    this.displayName = file.displayName;
    this.fullExtension = file.fullExtension;
    this.name = file.name;
    this.type = file.type;
    this.description = file.description;
    this.ownerID = file.ownerID;
    this.size = file.size;
    this.parent = file.parent;
    this.deleted = file.deleted;
    this.createdAt = file.createdAt.getTime();
    this.updatedAt = file.updatedAt.getTime();
  }
}