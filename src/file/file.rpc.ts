import { FileService } from './file.service';
import { IFile } from './file.interface';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/../../protos/file.proto`;

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
      params.fullName,
      params.ownerID,
      params.type,
      params.parent,
      params.key)
      .then((file) => {
        callback(null, file);
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
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  // Retrieves a file by its key.
  private async getFileByKey(call: any, callback: any) {
    const key: string = call.request.key;
    FileService.getByKey(key)
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  // Retrieves all files residing in a given folder.
  private async getFilesByFolder(call: any, callback: any) {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    FileService.getFilesByFolder(folderID, ownerID)
      .then((files) => {
        console.log(files);
        callback(null, { files });
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
