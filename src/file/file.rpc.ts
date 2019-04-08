import { FileService } from './file.service';
import { IFile } from './file.interface';

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

  private generateKey(call: any, callback: any) {
    const key: string = FileService.generateKey();
    callback(null, { key });
  }

  private async createFile(call: any, callback: any) {
    const partialFile: Partial<IFile> = {
      size: call.size,
    };

    FileService.create(
      partialFile,
      call.fullName,
      call.ownerID,
      call.type,
      call.parent,
      call.key)
      .then((file) => {
        callback(null, file);
      })
      .catch(err => callback(err));
  }

  private async deleteFile(call: any, callback: any) {
    const id: string = call.id;
    FileService.delete(id)
      .then(() => callback({ ok: true }))
      .catch(err => callback(err));
  }

  private async getFileByID(call: any, callback: any) {
    const id: string = call.id;
    FileService.getById(id)
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  private async getFileByKey(call: any, callback: any) {
    const key: string = call.key;
    FileService.getByKey(key)
      .then(file => callback(null, file))
      .catch(err => callback(err));
  }

  private async getFilesByFolder(call: any, callback: any) {
    const id: string = call.id;
    FileService.getById(id)
      .then(files => callback(null, files))
      .catch(err => callback(err));
  }

  private async isAllowed(call: any, callback: any) {
    FileService.isOwner(call.fileID, call.userID)
      .then(res => callback(res))
      .catch(err => callback(err));
  }

}
