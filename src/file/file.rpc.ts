import { FileService } from './file.service';
import { IFile } from './file.interface';
import { IUpload } from './upload.interface';

const PROTO_PATH = `${__dirname}/../../protos/file.proto`;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
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

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
const file_proto = protoDescriptor.file;

export class RPC {
  public server: any;

  public constructor(port: string) {
    this.server = new grpc.Server();
    this.server.addService(file_proto.FileService.service, {
      GenerateKey: this.generateKey,
      CreateUpload: this.createUpload,
      GetUploadByID: this.getUploadByID,
      DeleteUploadByID: this.deleteUploadByID,
      GetFileByID: this.getFileByID,
      GetFileByKey: this.getFileByKey,
      GetFilesByFolder: this.getFilesByFolder,
      CreateFile: this.createFile,
      DeleteFile: this.deleteFile,
      IsAllowed: this.isAllowed,
      // UpdateFile: Not yet implemented
    });
    this.server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  }

  // ***************************************************************** */
  // TODO
  private generateKey(call: any, callback: any) {
    const key: string = FileService.generateKey();
    callback(null, { key });
  }

    // TODO
  private async createUpload(call: any, callback: any) {
    const key: string = call.request.key;
    const bucket: string = call.request.bucket;
    const uploadID: string = call.request.uploadID;
    FileService.createUpload(
      uploadID,
      key,
      bucket)
      .then((upload) => {
        callback(null, upload);
      }).catch(err => callback(err));
  }

  // TODO
  private getUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    FileService.getUploadById(id)
    .then((upload) => {
      callback(null, upload);
    }).catch(err => callback(err));
  }

  // TODO
  private deleteUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    FileService.deleteUpload(id)
    .then((upload) => {
      callback(null, upload);
    }).catch(err => callback(err));
  }

  // ***************************************************************** */

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

  private async deleteFile(call: any, callback: any) {
    const id: string = call.request.id;
    FileService.delete(id)
      .then(() => callback({ ok: true }))
      .catch(err => callback(err));
  }

  private async getFileByID(call: any, callback: any) {
    const id: string = call.request.id;
    FileService.getById(id)
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  private async getFileByKey(call: any, callback: any) {
    const key: string = call.request.key;
    FileService.getByKey(key)
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  private async getFilesByFolder(call: any, callback: any) {
    const id: string = call.request.id;
    FileService.getById(id)
      .then(files => callback(null, files))
      .catch(err => callback(err));
  }

  private async isAllowed(call: any, callback: any) {
    FileService.isOwner(call.request.fileID, call.request.userID)
      .then(res => callback(res))
      .catch(err => callback(err));
  }

  // TODO
  private async updateUploadID(call: any, callback: any) {
    return;
  }

  // TODO
  private async getUploadByID(call: any, callback: any) {
    return;
  }

  // TODO
  private async deleteUploadByID(call: any, callback: any) {
    return;
  }

}
