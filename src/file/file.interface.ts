import { ObjectID } from 'mongodb';
class PrimitiveFile
{
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
  createdAt?: Date | number;
  updatedAt?: Date | number;

  constructor(file: PrimitiveFile) {
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
  }
}
export class IFile extends PrimitiveFile{
  createdAt?: Date;
  updatedAt?: Date;
}

// Same as IFile, but changing types accordingly
export class ResFile extends PrimitiveFile {
  createdAt: number;
  updatedAt: number;

  constructor(file: IFile) {
    super(file);
    this.createdAt = file.createdAt.getTime();
    this.updatedAt = file.updatedAt.getTime();
  }
}
