import { ObjectID } from 'mongodb';

export interface IBaseFile {
  [key: string]: any;
  fileModel: string;
}
export class PrimitiveFile implements IBaseFile {
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
  appID: string;
  float: boolean = false;
  [key: string]: string | number | ObjectID | Date | boolean | PrimitiveFile[];
  fileModel: string;

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
    this.appID = file.appID;
    this.fileModel = file.fileModel;
  }
}

export class IShortcut extends PrimitiveFile {
  id?: string;
  name: string;
  fileID: ObjectID | string;
  parent: ObjectID | string;
  isShortcut?: boolean;

  constructor(file: Partial<IShortcut>) {
    super(file);
    this.id = file.id;
    this.name = file.name;
    this.fileID = file.fileID;
    this.parent = file.parent;
  }
}

export class IPopulatedShortcut extends IShortcut {
  fileID: any;

  constructor(file: Partial<IPopulatedShortcut>) {
    super(file);
    this.fileID = file.fileID;
  }
}

export class IFile extends PrimitiveFile {
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
      for (let i = 0; i < resFile.children.length; i++) {
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
      for (let i = 0; i < file.children.length; i++) {
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
