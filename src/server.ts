import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import apm from 'elastic-apm-node';
import { GrpcHealthCheck, HealthCheckResponse, HealthService } from 'grpc-ts-health-check';
import { log, Severity, wrapper } from './utils/logger';
import { apmURL, verifyServerCert, serviceName, secretToken } from './config';
import { FileMethods } from './file/file.grpc';
import { UploadMethods } from './upload/upload.grpc';

apm.start({
  serviceName,
  secretToken,
  verifyServerCert,
  serverUrl: apmURL,
});

const PROTO_PATH: string = `${__dirname}/../proto/file.proto`;

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

// Has the full package hierarchy
const protoDescriptor: grpc.GrpcObject = grpc.loadPackageDefinition(packageDefinition);
const file_proto: any = protoDescriptor.file;

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

  private addServices() {
    // Register the health service
    this.grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    this.server.addService(HealthService, this.grpcHealthCheck);

    const fileService = {
      GenerateKey: wrapper(UploadMethods.GenerateKey),
      CreateUpload: wrapper(UploadMethods.CreateUpload),
      UpdateUploadID: wrapper(UploadMethods.UpdateUploadID),
      GetUploadByID: wrapper(UploadMethods.GetUploadByID),
      DeleteUploadByID: wrapper(UploadMethods.DeleteUploadByID),
      GetFileByID: wrapper(FileMethods.GetFileByID),
      GetFileByKey: wrapper(FileMethods.GetFileByKey),
      GetFilesByFolder: wrapper(FileMethods.GetFilesByFolder),
      GetDescendantsByFolder: wrapper(FileMethods.GetDescendantsByFolder),
      CreateFile: wrapper(FileMethods.CreateFile),
      DeleteFile: wrapper(FileMethods.DeleteFile),
      IsAllowed: wrapper(FileMethods.IsAllowed),
      UpdateFiles: wrapper(FileMethods.UpdateFiles),
    };

    this.server.addService(file_proto.FileService.service, fileService);
  }
}
