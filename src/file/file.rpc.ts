import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import apm from 'elastic-apm-node';
import { ObjectID } from 'mongodb';
import { GrpcHealthCheck, HealthCheckResponse, HealthService } from 'grpc-ts-health-check';
import { FileService } from './file.service';
import { IFile } from './file.interface';
import { elasticURL } from '../config';
import { statusToString, validateGrpcError } from '../utils/errors/grpc.status';
import { ApplicationError } from '../utils/errors/application.error';

apm.start({
  serviceName: 'file-service',
  secretToken: '',
  serverUrl: elasticURL,
});

const PROTO_PATH = `${__dirname}/../../proto/file.proto`;

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition : protoLoader.PackageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

// Has the full package hierarchy
const protoDescriptor : grpc.GrpcObject = grpc.loadPackageDefinition(packageDefinition);
const file_proto : any = protoDescriptor.file;

export const serviceNames: string[] = ['', 'file.fileService'];
export const healthCheckStatusMap = {
  '': HealthCheckResponse.ServingStatus.UNKNOWN,
  serviceName: HealthCheckResponse.ServingStatus.UNKNOWN
};

/**
 * The FileServer class, containing all of the FileServer methods.
 */
export class FileServer {

  public server: grpc.Server;
  public grpcHealthCheck: GrpcHealthCheck;

  public constructor(port: string) {
    this.server = new grpc.Server();
    this.addServices();
    this.server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
  }

  private addServices () {
    // Register the health service
    this.grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    this.server.addService(HealthService, this.grpcHealthCheck);

    const fileService = {
      GenerateKey: this.wrapper(this.GenerateKey),
      CreateUpload: this.wrapper(this.CreateUpload),
      UpdateUploadID: this.wrapper(this.UpdateUploadID),
      GetUploadByID: this.wrapper(this.GetUploadByID),
      DeleteUploadByID: this.wrapper(this.DeleteUploadByID),
      GetFileByID: this.wrapper(this.GetFileByID),
      GetFileByKey: this.wrapper(this.GetFileByKey),
      GetFilesByFolder: this.wrapper(this.GetFilesByFolder),
      CreateFile: this.wrapper(this.CreateFile),
      DeleteFile: this.wrapper(this.DeleteFile),
      IsAllowed: this.wrapper(this.IsAllowed),
    };

    this.server.addService(file_proto.FileService.service, fileService);
  }

  private wrapper (func: Function) :
  (call: grpc.ServerUnaryCall<Object>, callback: grpc.requestCallback<Object>) => Promise<void> {
    return async (call: grpc.ServerUnaryCall<Object>, callback: grpc.requestCallback<Object>) => {
      try {
        const traceparent = call.metadata.get('elastic-apm-traceparent');
        const transOptions = (traceparent.length > 0) ? { childOf: traceparent[0].toString() } : {};
        apm.startTransaction(`/file.FileService/${func.name}`, 'request', transOptions);
        const res = await func(call, callback);
        apm.endTransaction(statusToString(grpc.status.OK));
        callback(null, res);
      } catch (err) {
        const validatedErr : ApplicationError = validateGrpcError(err);
        apm.endTransaction(validatedErr.name);
        callback(validatedErr);
      }
    };

  }

  // ******************** UPLOAD FUNCTIONS ******************** */

  // Generates a random key for the upload.
  private GenerateKey(call: any, callback: any) {
    return { key: FileService.generateKey() };
  }

  // Creates an upload object, present while uploading a file.
  private async CreateUpload(call: any, callback: any) {
    const key: string = FileService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    const ownerID: string = call.request.ownerID;
    const parent: string = call.request.parent;
    const size: number = parseInt(call.request.size, 10);
    return FileService.createUpload(key, bucket, name, ownerID, parent, size);
  }

  // Updates the uploadID.
  private async UpdateUploadID(call: any, callback: any) {
    const key: string = call.request.key;
    const uploadID: string = call.request.uploadID;
    const bucket: string = call.request.bucket;
    return FileService.updateUpload(uploadID, key, bucket);
  }

  // Get an upload metadata by its id in the DB.
  private async GetUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    return FileService.getUploadById(id);
  }

  //  Delete an upload from the DB by its id.
  private async DeleteUploadByID(call: any, callback: any) {
    const id = call.request.uploadID;
    return FileService.deleteUpload(id);
  }

  // ********************* FILE FUNCTIONS ********************* */

  // Creates a new file in the DB.
  private async CreateFile(call: any, callback: any) {
    const params = call.request;
    const createdFile = await FileService.create(
      params.bucket,
      params.name,
      params.ownerID,
      params.type,
      params.parent,
      params.key,
      parseInt(params.size, 10),
    );
    return new ResFile(createdFile);
  }

  // Deletes a file, according to the file deletion policy.
  private async DeleteFile(call: any, callback: any) {
    const id: string = call.request.id;
    await FileService.delete(id);
    return { ok: true };
  }

  // Retrieves a file by its id.
  private async GetFileByID(call: any, callback: any) {
    const id: string = call.request.id;
    const file = await FileService.getById(id);
    return new ResFile(file);
  }

  // Retrieves a file by its key.
  private async GetFileByKey(call: any, callback: any) {
    const key: string = call.request.key;
    const file = await FileService.getByKey(key);
    return new ResFile(file);
  }

  // Retrieves all files residing in a given folder.
  private async GetFilesByFolder(call: any, callback: any) {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    const files = await FileService.getFilesByFolder(folderID, ownerID);
    const resFiles = files.length ? files.map(file => new ResFile(file)) : [];
    return { files: resFiles };

  }

  // Checks if an operation is allowed by permission of the owner.
  private async IsAllowed(call: any, callback: any) {
    const res = await FileService.isOwner(call.request.fileID, call.request.userID);
    return  { allowed: res };
  }

}

// Same as IFile, but changing types accordingly
class ResFile {
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
