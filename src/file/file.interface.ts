import { ObjectID } from 'mongodb';
export class PrimitiveFile
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
  size: number = 0;
  parent?: ObjectID | string;
  createdAt?: Date | number;
  updatedAt?: Date | number;
  children?: PrimitiveFile[] = [];
  float: boolean = false;
  [key: string]: string | number | ObjectID | Date | boolean | PrimitiveFile[];

  constructor(file: Partial<PrimitiveFile>) {
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
    this.float = file.float;
  }
}
export class IFile extends PrimitiveFile{
  children?: IFile[] = undefined;
  createdAt?: Date;
  updatedAt?: Date;
  size: number = 0;

  constructor(resFile: ResFile) {
    super(resFile);
    // the '+' translates the string to int
    if (+resFile.createdAt) {
      this.createdAt = new Date(+resFile.createdAt);
    }
    if (+resFile.updatedAt) {
      this.updatedAt = new Date(+resFile.updatedAt);
    }
    if (resFile.children) {
      for (let i = 0 ; i < resFile.children.length ; i++) {
        new IFile(resFile.children[i]);
      }
    }
    this.size = +resFile.size;
  }
}

// Same as IFile, but changing types accordingly
export class ResFile extends PrimitiveFile {
  createdAt: number;
  updatedAt: number;
  children?: ResFile[] = [];

  constructor(file: IFile) {
    super(file);
    this.createdAt = file.createdAt.getTime();
    this.updatedAt = file.updatedAt.getTime();
    if (file.children) {
      for (let i = 0 ; i < file.children.length ; i++) {
        new ResFile(file.children[i]);
      }
    }
  }
}

// A type for the return value of file deletion in the grpc
export type deleteRes = {
  id: string,
  key: string,
  bucket: string,
};
