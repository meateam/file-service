import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import apm from 'elastic-apm-node';
import { GrpcHealthCheck, HealthCheckResponse, HealthService, HealthClient, HealthCheckRequest } from 'grpc-ts-health-check';
import { log, Severity, wrapper } from './utils/logger';
import { apmURL, verifyServerCert, serviceName, secretToken } from './config';
import { FileMethods } from './file/file.grpc';
import { UploadMethods } from './upload/upload.grpc';
import { QuotaMethods } from './quota/quota.grpc';

apm.start({
  serviceName,
  secretToken,
  verifyServerCert,
  serverUrl: apmURL,
});

const FILE_PROTO_PATH: string = `${__dirname}/../proto/file/file.proto`;
const QUOTA_PROTO_PATH: string = `${__dirname}/../proto/quota/quota.proto`;

// Suggested options for similarity to existing grpc.load behavior
const filePackageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(
  FILE_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
const quotaPackageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(
  QUOTA_PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

// Has the full package hierarchy
const fileProtoDescriptor: grpc.GrpcObject = grpc.loadPackageDefinition(filePackageDefinition);
const quotaProtoDescriptor: grpc.GrpcObject = grpc.loadPackageDefinition(quotaPackageDefinition);

const file_proto: any = fileProtoDescriptor.file;
const quota_proto: any = quotaProtoDescriptor.quota;

export const healthCheckStatusMap: any = {
  '': HealthCheckResponse.ServingStatus.UNKNOWN,
  [serviceName]: HealthCheckResponse.ServingStatus.UNKNOWN
};
const servicesNum = Object.keys(healthCheckStatusMap).length;

// The FileServer class, containing all of the FileServer methods.
export class FileServer {
  public server: grpc.Server;
  public grpcHealthCheck: GrpcHealthCheck;
  public requests: HealthCheckRequest[];
  public healthClient: HealthClient;

  public constructor(address: string) {
    // Create the server
    this.server = new grpc.Server();
    this.requests = Array<HealthCheckRequest>(servicesNum);

    this.addServices();

    // Create the health client
    this.healthClient = new HealthClient(address, grpc.credentials.createInsecure());

    this.server.bind(address, grpc.ServerCredentials.createInsecure());
    log(Severity.INFO, `server listening on address: ${address}`, 'server bind');
  }

  private addServices() {
    // RegisterHealthService the health service
    this.grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    this.server.addService(HealthService, this.grpcHealthCheck);

    // Set services
    for (const service in healthCheckStatusMap) {
      const request = new HealthCheckRequest();
      request.setService(service);
      this.requests.push(request);
    }

    const fileService = {
      GenerateKey: wrapper(UploadMethods.GenerateKey),
      CreateUpload: wrapper(UploadMethods.CreateUpload),
      CreateUpdate: wrapper(UploadMethods.CreateUpdate),
      UpdateUploadID: wrapper(UploadMethods.UpdateUploadID),
      GetUploadByID: wrapper(UploadMethods.GetUploadByID),
      DeleteUploadByID: wrapper(UploadMethods.DeleteUploadByID),
      DeleteUploadByKey: wrapper(UploadMethods.DeleteUploadByKey),
      GetFileByID: wrapper(FileMethods.GetFileByID),
      GetFilesByIDs: wrapper(FileMethods.GetFilesByIDs),
      GetFileByKey: wrapper(FileMethods.GetFileByKey),
      GetFilesByFolder: wrapper(FileMethods.GetFilesByFolder),
      GetDescendantsByFolder: wrapper(FileMethods.GetDescendantsByFolder),
      CreateFile: wrapper(FileMethods.CreateFile),
      DeleteFile: wrapper(FileMethods.DeleteFile),
      IsAllowed: wrapper(FileMethods.IsAllowed),
      UpdateFiles: wrapper(FileMethods.UpdateFiles),
      GetAncestors: wrapper(FileMethods.GetAncestors),
      GetDescendantsByID: wrapper(FileMethods.GetDescendantsByID),
      DeleteFileByID: wrapper(FileMethods.DeleteFileByID),
    };

    this.server.addService(file_proto.FileService.service, fileService);

    const quotaService = {
      GetOwnerQuota: wrapper(QuotaMethods.GetOwnerQuota),
      IsAllowedToGetQuota: wrapper(QuotaMethods.IsAllowedToGetQuota),
      UpdateQuota: wrapper(QuotaMethods.UpdateQuota)
    };

    this.server.addService(quota_proto.QuotaService.service, quotaService);
  }
}
