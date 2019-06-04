import { FileService } from './file.service';
import { IFile } from './file.interface';
import { IUser } from '../utils/user.interface';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/../../proto/file.proto`;

// Suggested options for similarity to existing grpc.load behavior

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

// Has the full package hierarchy
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const file_proto = protoDescriptor.file;

/**
 * The RPC class, containing all of the RPC methods.
 */
export class RPC {
  public server: any;

  public constructor(port: string) {
    this.server = new grpc.Server();
    this.server.addService(file_proto.FileService.service, {
      GenerateKey: this.generateKey,
      CreateUpload: this.createUpload,
      UpdateUploadID: this.updateUpload,
      GetUploadByID: this.getUploadByID,
      DeleteUploadByID: this.deleteUploadByID,
      GetFileByID: this.getFileByID,
      GetFileByKey: this.getFileByKey,
      GetFilesByFolder: this.getFilesByFolder,
      CreateFile: this.createFile,
      DeleteFile: this.deleteFile,
      IsAllowed: this.isAllowed,
    });
    this.server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  }

  // ******************** UPLOAD FUNCTIONS ******************** */

  // Generates a random key for the upload.
  private generateKey(call: any, callback: any) {
    const key: string = FileService.generateKey();
    callback(null, { key });
  }

  // Creates an upload object, present while uploading a file.
  private async createUpload(call: any, callback: any) {
    const key: string = FileService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    FileService.createUpload(
      key,
      bucket,
      name)
      .then((upload) => {
        callback(null, upload);
      }).catch(err => callback(err));
  }

  // Updates the uploadID.
  private async updateUpload(call: any, callback: any) {
    const key: string = call.request.key;
    const uploadID: string = call.request.uploadID;
    const bucket: string = call.request.bucket;
    FileService.updateUpload(
      uploadID,
      key,
      bucket)
      .then((upload) => {
        callback(null, upload);
      }).catch(err => callback(err));
  }

  // Get an upload metadata by its id in the DB.
  private async getUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    FileService.getUploadById(id)
    .then((upload) => {
      callback(null, upload);
    }).catch(err => callback(err));
  }

  //  Delete an upload from the DB by its id.
  private async deleteUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    FileService.deleteUpload(id)
    .then((upload) => {
      callback(null, upload);
    }).catch(err => callback(err));
  }

  // ********************* FILE FUNCTIONS ********************* */

  // Creates a new file in the DB.
  private async createFile(call: any, callback: any) {
    const params = call.request;
    const partialFile: Partial<IFile> = {
      size: params.size,
      bucket: params.bucket,
    };

    FileService.create(
      partialFile,
      params.name,
      params.ownerID,
      params.type,
      params.parent,
      params.key)
      .then((file) => {
        callback(null, new ResFile(file));
      })
      .catch(err => callback(err));
  }

  // Deletes a file, according to the file deletion policy.
  private async deleteFile(call: any, callback: any) {
    const id: string = call.request.id;
    FileService.delete(id)
      .then(() => callback(null, { ok: true }))
      .catch(err => callback(err));
  }

  // Retrieves a file by its id.
  private async getFileByID(call: any, callback: any) {
    const id: string = call.request.id;
    FileService.getById(id)
      .then(file => callback(null, new ResFile(file)))
      .catch(err => callback(err));
  }

  // Retrieves a file by its key.
  private async getFileByKey(call: any, callback: any) {
    const key: string = call.request.key;
    FileService.getByKey(key)
      .then(file => callback(null, new ResFile(file)))
      .catch(err => callback(err));
  }

  // Retrieves all files residing in a given folder.
  private async getFilesByFolder(call: any, callback: any) {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    FileService.getFilesByFolder(folderID, ownerID)
      .then((files) => {
        const resFiles = files.length ? files.map(file => new ResFile(file)) : [];
        callback(null, { files: resFiles });
      })
      .catch(err => callback(err));
  }

  // Checks if an operation is allowed by permission of the owner.
  private async isAllowed(call: any, callback: any) {
    FileService.isOwner(call.request.fileID, call.request.userID)
      .then(res => callback(null, { allowed: res }))
      .catch(err => callback(err));
  }

}

// Same as IFile, but changing types accordingly
class ResFile{
  id: string;
  key: string;
  bucket: string;
  displayName: string;
  fullExtension: string;
  name: string;
  type: string;
  description: string;
  ownerID: string;
  owner: IUser;
  size: number;
  parent: IFile | string;
  ancestors: IFile[] | string[];
  children: IFile[] | string[];
  isRootFolder: boolean;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  constructor(file: IFile) {
    this.id              =     file.id;
    this.key             =     file.key;
    this.bucket          =     file.bucket;
    this.displayName     =     file.displayName;
    this.fullExtension   =     file.fullExtension;
    this.name            =     file.name;
    this.type            =     file.type;
    this.description     =     file.description;
    this.ownerID         =     file.ownerID;
    this.owner           =     file.owner;
    this.size            =     file.size;
    this.parent          =     file.parent;
    this.ancestors       =     file.ancestors;
    this.children        =     file.children;
    this.isRootFolder    =     file.isRootFolder;
    this.deleted         =     file.deleted;
    this.createdAt       =     file.createdAt.getTime();
    this.updatedAt       =     file.updatedAt.getTime();
  }
}
