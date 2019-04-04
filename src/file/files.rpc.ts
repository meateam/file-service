import { FileService } from '../src/file/file.service';
import { IFile } from '../src/file/file.interface';

const PROTO_PATH = `${__dirname}/../../protos/users.proto`;
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
const users_proto = protoDescriptor.users;

export class RPC {
  public server: any;

  public constructor(port: string) {
    this.server = new grpc.Server();
    this.server.addService(users_proto.Users.service, {
      GetFileByID: this.getFileByID,
      CreateFile: this.createFile,
    });
    this.server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  }

  private async getFileByID(call: any, callback: any) {
    const userID = call.request.userID;
    const file: IFile | null = await FileService.findById(call.request.id);
    if (!file) {
      return callback({
        code: '404',
        message: `The file with id ${call.request.id}, is not found`,
        status: grpc.status.NOT_FOUND,
      });
    }
    callback(null, file);
  }
  private async createFile(call: any, callback: any) {
    const file: IFile = {
      key: call.request.key,
      name: call.request.name,
      mimeType: call.request.mimeType,
      description: call.request.description,
      ownerID: call.request.ownerID,
      size: call.request.size,
      parent: call.request.parent,
    };
    const createdFile: IFile | null = await FileService.create(file);

    if (!createdFile) {
      return callback({
        code: '500',
        message: 'Error in creating the file',
        status: grpc.status.INTERNAL,
      });
    }
    callback(null, file);
  }

}
