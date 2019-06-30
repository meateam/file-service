// package: file
// file: file.proto

import * as file_pb from "./file_pb";
import {grpc} from "@improbable-eng/grpc-web";

type FileServiceGenerateKey = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GenerateKeyRequest;
  readonly responseType: typeof file_pb.KeyResponse;
};

type FileServiceCreateUpload = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.CreateUploadRequest;
  readonly responseType: typeof file_pb.CreateUploadResponse;
};

type FileServiceUpdateUploadID = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.UpdateUploadIDRequest;
  readonly responseType: typeof file_pb.UpdateUploadIDResponse;
};

type FileServiceGetUploadByID = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GetUploadByIDRequest;
  readonly responseType: typeof file_pb.GetUploadByIDResponse;
};

type FileServiceDeleteUploadByID = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.DeleteUploadByIDRequest;
  readonly responseType: typeof file_pb.DeleteUploadByIDResponse;
};

type FileServiceGetFileByID = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GetByFileByIDRequest;
  readonly responseType: typeof file_pb.File;
};

type FileServiceGetFileByKey = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GetFileByKeyRequest;
  readonly responseType: typeof file_pb.File;
};

type FileServiceGetFilesByFolder = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GetFilesByFolderRequest;
  readonly responseType: typeof file_pb.GetFilesByFolderResponse;
};

type FileServiceCreateFile = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.CreateFileRequest;
  readonly responseType: typeof file_pb.File;
};

type FileServiceDeleteFile = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.DeleteFileRequest;
  readonly responseType: typeof file_pb.DeleteFileResponse;
};

type FileServiceUpdateFile = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.UpdateFileRequest;
  readonly responseType: typeof file_pb.File;
};

type FileServiceIsAllowed = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.IsAllowedRequest;
  readonly responseType: typeof file_pb.IsAllowedResponse;
};

type FileServiceGetOwnerQuota = {
  readonly methodName: string;
  readonly service: typeof FileService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof file_pb.GetOwnerQuotaRequest;
  readonly responseType: typeof file_pb.GetOwnerQuotaResponse;
};

export class FileService {
  static readonly serviceName: string;
  static readonly GenerateKey: FileServiceGenerateKey;
  static readonly CreateUpload: FileServiceCreateUpload;
  static readonly UpdateUploadID: FileServiceUpdateUploadID;
  static readonly GetUploadByID: FileServiceGetUploadByID;
  static readonly DeleteUploadByID: FileServiceDeleteUploadByID;
  static readonly GetFileByID: FileServiceGetFileByID;
  static readonly GetFileByKey: FileServiceGetFileByKey;
  static readonly GetFilesByFolder: FileServiceGetFilesByFolder;
  static readonly CreateFile: FileServiceCreateFile;
  static readonly DeleteFile: FileServiceDeleteFile;
  static readonly UpdateFile: FileServiceUpdateFile;
  static readonly IsAllowed: FileServiceIsAllowed;
  static readonly GetOwnerQuota: FileServiceGetOwnerQuota;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class FileServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  generateKey(
    requestMessage: file_pb.GenerateKeyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.KeyResponse|null) => void
  ): UnaryResponse;
  generateKey(
    requestMessage: file_pb.GenerateKeyRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.KeyResponse|null) => void
  ): UnaryResponse;
  createUpload(
    requestMessage: file_pb.CreateUploadRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.CreateUploadResponse|null) => void
  ): UnaryResponse;
  createUpload(
    requestMessage: file_pb.CreateUploadRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.CreateUploadResponse|null) => void
  ): UnaryResponse;
  updateUploadID(
    requestMessage: file_pb.UpdateUploadIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.UpdateUploadIDResponse|null) => void
  ): UnaryResponse;
  updateUploadID(
    requestMessage: file_pb.UpdateUploadIDRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.UpdateUploadIDResponse|null) => void
  ): UnaryResponse;
  getUploadByID(
    requestMessage: file_pb.GetUploadByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetUploadByIDResponse|null) => void
  ): UnaryResponse;
  getUploadByID(
    requestMessage: file_pb.GetUploadByIDRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetUploadByIDResponse|null) => void
  ): UnaryResponse;
  deleteUploadByID(
    requestMessage: file_pb.DeleteUploadByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.DeleteUploadByIDResponse|null) => void
  ): UnaryResponse;
  deleteUploadByID(
    requestMessage: file_pb.DeleteUploadByIDRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.DeleteUploadByIDResponse|null) => void
  ): UnaryResponse;
  getFileByID(
    requestMessage: file_pb.GetByFileByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  getFileByID(
    requestMessage: file_pb.GetByFileByIDRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  getFileByKey(
    requestMessage: file_pb.GetFileByKeyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  getFileByKey(
    requestMessage: file_pb.GetFileByKeyRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  getFilesByFolder(
    requestMessage: file_pb.GetFilesByFolderRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetFilesByFolderResponse|null) => void
  ): UnaryResponse;
  getFilesByFolder(
    requestMessage: file_pb.GetFilesByFolderRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetFilesByFolderResponse|null) => void
  ): UnaryResponse;
  createFile(
    requestMessage: file_pb.CreateFileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  createFile(
    requestMessage: file_pb.CreateFileRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  deleteFile(
    requestMessage: file_pb.DeleteFileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.DeleteFileResponse|null) => void
  ): UnaryResponse;
  deleteFile(
    requestMessage: file_pb.DeleteFileRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.DeleteFileResponse|null) => void
  ): UnaryResponse;
  updateFile(
    requestMessage: file_pb.UpdateFileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  updateFile(
    requestMessage: file_pb.UpdateFileRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.File|null) => void
  ): UnaryResponse;
  isAllowed(
    requestMessage: file_pb.IsAllowedRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.IsAllowedResponse|null) => void
  ): UnaryResponse;
  isAllowed(
    requestMessage: file_pb.IsAllowedRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.IsAllowedResponse|null) => void
  ): UnaryResponse;
  getOwnerQuota(
    requestMessage: file_pb.GetOwnerQuotaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetOwnerQuotaResponse|null) => void
  ): UnaryResponse;
  getOwnerQuota(
    requestMessage: file_pb.GetOwnerQuotaRequest,
    callback: (error: ServiceError|null, responseMessage: file_pb.GetOwnerQuotaResponse|null) => void
  ): UnaryResponse;
}

