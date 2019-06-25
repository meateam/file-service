import { FileService } from './file.service';
import { IFile } from './file.interface';
import { log } from '../utils/logger';
import { ObjectID } from 'mongodb';
import { GrpcHealthCheck, HealthCheckResponse, HealthService } from 'grpc-ts-health-check';

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

export const serviceNames: string[] = ['', 'file.fileService'];
export const healthCheckStatusMap = {
  '': HealthCheckResponse.ServingStatus.UNKNOWN,
  serviceName: HealthCheckResponse.ServingStatus.UNKNOWN
};

// Has the full package hierarchy
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const file_proto = protoDescriptor.file;

/**
 * The FileServer class, containing all of the FileServer methods.
 */
export class FileServer {
  public server: any;
  public grpcHealthCheck: GrpcHealthCheck;
  public constructor(port: string) {
    this.server = new grpc.Server();

    // Register the health service
    this.grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);
    this.server.addService(HealthService, this.grpcHealthCheck);
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
    const methodName = 'generateKey';
    logOnEntry(methodName, call.request);
    const key: string = FileService.generateKey();
    logOnFinish(methodName);
    callback(null, { key });
  }

  // Creates an upload object, present while uploading a file.
  private async createUpload(call: any, callback: any) {
    const methodName = 'createUpload';
    logOnEntry(methodName, call.request);
    const key: string = FileService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    const ownerID: string = call.request.ownerID;
    const parent: string = call.request.parent;
    const size: number = parseInt(call.request.size, 10);
    FileService.createUpload(
      key,
      bucket,
      name,
      ownerID,
      parent,
      size)
      .then((upload) => {
        logOnFinish(methodName);
        callback(null, upload);
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Updates the uploadID.
  private async updateUpload(call: any, callback: any) {
    const methodName = 'updateUpload';
    logOnEntry(methodName, call.request);
    const key: string = call.request.key;
    const uploadID: string = call.request.uploadID;
    const bucket: string = call.request.bucket;
    FileService.updateUpload(
      uploadID,
      key,
      bucket)
      .then((upload) => {
        logOnFinish(methodName);
        callback(null, upload);
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Get an upload metadata by its id in the DB.
  private async getUploadByID(call: any, callback: any) {
    const methodName = 'getUploadByID';
    logOnEntry(methodName, call.request);
    const id = call.request.uploadID;
    FileService.getUploadById(id)
      .then((upload) => {
        logOnFinish(methodName);
        callback(null, upload);
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  //  Delete an upload from the DB by its id.
  private async deleteUploadByID(call: any, callback: any) {
    const methodName = 'deleteUploadByID';
    logOnEntry(methodName, call.request);
    const id = call.request.uploadID;
    FileService.deleteUpload(id)
      .then((upload) => {
        logOnFinish(methodName);
        callback(null, upload);
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // ********************* FILE FUNCTIONS ********************* */

  // Creates a new file in the DB.
  private async createFile(call: any, callback: any) {
    const methodName = 'createFile';
    logOnEntry(methodName, call.request);
    const params = call.request;

    FileService.create(
      params.bucket,
      params.name,
      params.ownerID,
      params.type,
      params.parent,
      params.key,
      parseInt(params.size, 10))
      .then((file) => {
        logOnFinish(methodName);
        callback(null, new ResFile(file));
      })
      .catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Deletes a file, according to the file deletion policy.
  private async deleteFile(call: any, callback: any) {
    const methodName = 'deleteFile';
    logOnEntry(methodName, call.request);
    const id: string = call.request.id;
    FileService.delete(id)
      .then(() => {
        logOnFinish(methodName);
        callback(null, { ok: true });
      })
      .catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Retrieves a file by its id.
  private async getFileByID(call: any, callback: any) {
    const methodName = 'getFileByID';
    logOnEntry(methodName, call.request);
    const id: string = call.request.id;
    FileService.getById(id)
      .then((file) => {
        logOnFinish(methodName);
        callback(null, new ResFile(file));
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Retrieves a file by its key.
  private async getFileByKey(call: any, callback: any) {
    const methodName = 'getFileByKey';
    logOnEntry(methodName, call.request);
    const key: string = call.request.key;
    FileService.getByKey(key)
      .then((file) => {
        logOnFinish(methodName);
        callback(null, new ResFile(file));
      })
      .catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Retrieves all files residing in a given folder.
  private async getFilesByFolder(call: any, callback: any) {
    const methodName = 'getFilesByFolder';
    logOnEntry(methodName, call.request);
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    FileService.getFilesByFolder(folderID, ownerID)
      .then((files) => {
        const resFiles = files.length ? files.map(file => new ResFile(file)) : [];
        logOnFinish(methodName);
        callback(null, { files: resFiles });
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
  }

  // Checks if an operation is allowed by permission of the owner.
  private async isAllowed(call: any, callback: any) {
    const methodName = 'isAllowed';
    logOnEntry(methodName, call.request);
    FileService.isOwner(call.request.fileID, call.request.userID)
      .then((res) => {
        logOnFinish(methodName);
        callback(null, { allowed: res });
      }).catch((err) => {
        logOnError(methodName, err);
        callback(err);
      });
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

function logOnEntry(methodName : string, fields: any) : void {
  let description : string = '';
  for (const key of Object.keys(fields)) {
    const fieldName : string = fields[key].toString();
    description += `${key} : ${fieldName}, `;
  }
  log('info', `in ${methodName}`, description);
}

function logOnFinish(methodName : string) : void {
  log('info', `in ${methodName}`, 'Finished successfully');
}

function logOnError(methodName : string, err: Error) : void {
  log('error', `in ${methodName}`, err.message);
}
