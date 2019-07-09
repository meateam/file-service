import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import apm from 'elastic-apm-node';
import { GrpcHealthCheck, HealthCheckResponse, HealthService } from 'grpc-ts-health-check';
import { FileService } from './file/file.service';
import { log, Severity, wrapper } from './utils/logger';
import { IFile, ResFile } from './file/file.interface';
import { apmURL, verifyServerCert, serviceName, secretToken } from './config';
import { IUpload } from './upload/upload.interface';

apm.start({
  serviceName,
  secretToken,
  verifyServerCert,
  serverUrl: apmURL,
});

const PROTO_PATH: string = `${__dirname}/../proto/file.proto`;

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

// The FileServer class, containing all of the FileServer methods.
export class FileServer {

  public server: grpc.Server;
  public grpcHealthCheck: GrpcHealthCheck;

  public constructor(port: string) {
    this.server = new grpc.Server();
    this.addServices();
    this.server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
    log(Severity.INFO, 'server bind', `server listening on port: ${port}`);
  }

  private addServices () {
    // Register the health service
    this.grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    this.server.addService(HealthService, this.grpcHealthCheck);

    const fileService = {
      GenerateKey: wrapper(this.GenerateKey),
      CreateUpload: wrapper(this.CreateUpload),
      UpdateUploadID: wrapper(this.UpdateUploadID),
      GetUploadByID: wrapper(this.GetUploadByID),
      DeleteUploadByID: wrapper(this.DeleteUploadByID),
      GetFileByID: wrapper(this.GetFileByID),
      GetFileByKey: wrapper(this.GetFileByKey),
      GetFilesByFolder: wrapper(this.GetFilesByFolder),
      CreateFile: wrapper(this.CreateFile),
      DeleteFile: wrapper(this.DeleteFile),
      IsAllowed: wrapper(this.IsAllowed),
    };

    this.server.addService(file_proto.FileService.service, fileService);
  }

  // ******************** UPLOAD FUNCTIONS ******************** */

  // Generates a random key for the upload.
  private GenerateKey(call: any, callback: any) {
    return { key: FileService.generateKey() };
  }

  // Creates an upload object, present while uploading a file.
  private async CreateUpload(call: any, callback: any): Promise<IUpload> {
    const key: string = FileService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    const ownerID: string = call.request.ownerID;
    const parent: string = call.request.parent;
    const size: number = parseInt(call.request.size, 10);
    return FileService.createUpload(key, bucket, name, ownerID, parent, size);
  }

  // Updates the uploadID.
  private async UpdateUploadID(call: any, callback: any): Promise<IUpload> {
    const key: string = call.request.key;
    const uploadID: string = call.request.uploadID;
    const bucket: string = call.request.bucket;
    return FileService.updateUpload(uploadID, key, bucket);
  }

  // Get an upload metadata by its id in the DB.
  private async GetUploadByID(call: any, callback: any): Promise<IUpload> {
    const id: string = call.request.uploadID;
    return FileService.getUploadById(id);
  }

  //  Delete an upload from the DB by its id.
  private async DeleteUploadByID(call: any, callback: any): Promise<void> {
    const id: string = call.request.uploadID;
    return FileService.deleteUpload(id);
  }

  // ********************* FILE FUNCTIONS ********************* */

  // Creates a new file in the DB.
  private async CreateFile(call: any, callback: any): Promise<ResFile> {
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
  private async DeleteFile(call: any, callback: any): Promise<{ok: boolean}> {
    const id: string = call.request.id;
    await FileService.delete(id);
    return { ok: true };
  }

  // Retrieves a file by its id.
  private async GetFileByID(call: any, callback: any): Promise<ResFile> {
    const id: string = call.request.id;
    const file: IFile = await FileService.getById(id);
    return new ResFile(file);
  }

  // Retrieves a file by its key.
  private async GetFileByKey(call: any, callback: any): Promise<ResFile> {
    const key: string = call.request.key;
    const file: IFile = await FileService.getByKey(key);
    return new ResFile(file);
  }

  // Retrieves all files residing in a given folder.
  private async GetFilesByFolder(call: any, callback: any): Promise<{ files: ResFile[] }> {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    const files: IFile[] = await FileService.getFilesByFolder(folderID, ownerID);
    const resFiles: ResFile[] = files.length ? files.map(file => new ResFile(file)) : [];
    return { files: resFiles };
  }

  // Checks if an operation is allowed by permission of the owner.
  private async IsAllowed(call: any, callback: any): Promise<{ allowed: boolean }> {
    const res: boolean = await FileService.isOwner(call.request.fileID, call.request.userID);
    return  { allowed: res };
  }

}
