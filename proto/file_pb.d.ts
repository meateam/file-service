// package: file
// file: proto/file.proto

import * as jspb from "google-protobuf";

export class GetOwnerQuotaRequest extends jspb.Message {
  getOwnerid(): string;
  setOwnerid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOwnerQuotaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetOwnerQuotaRequest): GetOwnerQuotaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOwnerQuotaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOwnerQuotaRequest;
  static deserializeBinaryFromReader(message: GetOwnerQuotaRequest, reader: jspb.BinaryReader): GetOwnerQuotaRequest;
}

export namespace GetOwnerQuotaRequest {
  export type AsObject = {
    ownerid: string,
  }
}

export class GetOwnerQuotaResponse extends jspb.Message {
  getOwnerid(): string;
  setOwnerid(value: string): void;

  getLimit(): number;
  setLimit(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOwnerQuotaResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetOwnerQuotaResponse): GetOwnerQuotaResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOwnerQuotaResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOwnerQuotaResponse;
  static deserializeBinaryFromReader(message: GetOwnerQuotaResponse, reader: jspb.BinaryReader): GetOwnerQuotaResponse;
}

export namespace GetOwnerQuotaResponse {
  export type AsObject = {
    ownerid: string,
    limit: number,
    size: number,
  }
}

export class CreateUploadRequest extends jspb.Message {
  getBucket(): string;
  setBucket(value: string): void;

  getName(): string;
  setName(value: string): void;

  getOwnerid(): string;
  setOwnerid(value: string): void;

  getParent(): string;
  setParent(value: string): void;

  getSize(): number;
  setSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUploadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUploadRequest): CreateUploadRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateUploadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUploadRequest;
  static deserializeBinaryFromReader(message: CreateUploadRequest, reader: jspb.BinaryReader): CreateUploadRequest;
}

export namespace CreateUploadRequest {
  export type AsObject = {
    bucket: string,
    name: string,
    ownerid: string,
    parent: string,
    size: number,
  }
}

export class CreateUploadResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUploadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUploadResponse): CreateUploadResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateUploadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUploadResponse;
  static deserializeBinaryFromReader(message: CreateUploadResponse, reader: jspb.BinaryReader): CreateUploadResponse;
}

export namespace CreateUploadResponse {
  export type AsObject = {
    key: string,
    bucket: string,
  }
}

export class GenerateKeyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateKeyRequest): GenerateKeyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenerateKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateKeyRequest;
  static deserializeBinaryFromReader(message: GenerateKeyRequest, reader: jspb.BinaryReader): GenerateKeyRequest;
}

export namespace GenerateKeyRequest {
  export type AsObject = {
  }
}

export class KeyResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: KeyResponse): KeyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyResponse;
  static deserializeBinaryFromReader(message: KeyResponse, reader: jspb.BinaryReader): KeyResponse;
}

export namespace KeyResponse {
  export type AsObject = {
    key: string,
  }
}

export class UpdateUploadIDRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getUploadid(): string;
  setUploadid(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUploadIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUploadIDRequest): UpdateUploadIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateUploadIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUploadIDRequest;
  static deserializeBinaryFromReader(message: UpdateUploadIDRequest, reader: jspb.BinaryReader): UpdateUploadIDRequest;
}

export namespace UpdateUploadIDRequest {
  export type AsObject = {
    key: string,
    uploadid: string,
    bucket: string,
  }
}

export class UpdateUploadIDResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUploadIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUploadIDResponse): UpdateUploadIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateUploadIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUploadIDResponse;
  static deserializeBinaryFromReader(message: UpdateUploadIDResponse, reader: jspb.BinaryReader): UpdateUploadIDResponse;
}

export namespace UpdateUploadIDResponse {
  export type AsObject = {
  }
}

export class GetUploadByIDRequest extends jspb.Message {
  getUploadid(): string;
  setUploadid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUploadByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUploadByIDRequest): GetUploadByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUploadByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUploadByIDRequest;
  static deserializeBinaryFromReader(message: GetUploadByIDRequest, reader: jspb.BinaryReader): GetUploadByIDRequest;
}

export namespace GetUploadByIDRequest {
  export type AsObject = {
    uploadid: string,
  }
}

export class GetUploadByIDResponse extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  getUploadid(): string;
  setUploadid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUploadByIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUploadByIDResponse): GetUploadByIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUploadByIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUploadByIDResponse;
  static deserializeBinaryFromReader(message: GetUploadByIDResponse, reader: jspb.BinaryReader): GetUploadByIDResponse;
}

export namespace GetUploadByIDResponse {
  export type AsObject = {
    key: string,
    bucket: string,
    uploadid: string,
    name: string,
  }
}

export class DeleteUploadByIDRequest extends jspb.Message {
  getUploadid(): string;
  setUploadid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUploadByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUploadByIDRequest): DeleteUploadByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteUploadByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUploadByIDRequest;
  static deserializeBinaryFromReader(message: DeleteUploadByIDRequest, reader: jspb.BinaryReader): DeleteUploadByIDRequest;
}

export namespace DeleteUploadByIDRequest {
  export type AsObject = {
    uploadid: string,
  }
}

export class DeleteUploadByIDResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUploadByIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUploadByIDResponse): DeleteUploadByIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteUploadByIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUploadByIDResponse;
  static deserializeBinaryFromReader(message: DeleteUploadByIDResponse, reader: jspb.BinaryReader): DeleteUploadByIDResponse;
}

export namespace DeleteUploadByIDResponse {
  export type AsObject = {
  }
}

export class GetByFileByIDRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetByFileByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetByFileByIDRequest): GetByFileByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetByFileByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetByFileByIDRequest;
  static deserializeBinaryFromReader(message: GetByFileByIDRequest, reader: jspb.BinaryReader): GetByFileByIDRequest;
}

export namespace GetByFileByIDRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetFileByKeyRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFileByKeyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFileByKeyRequest): GetFileByKeyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetFileByKeyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFileByKeyRequest;
  static deserializeBinaryFromReader(message: GetFileByKeyRequest, reader: jspb.BinaryReader): GetFileByKeyRequest;
}

export namespace GetFileByKeyRequest {
  export type AsObject = {
    key: string,
  }
}

export class GetFilesByFolderRequest extends jspb.Message {
  getFolderid(): string;
  setFolderid(value: string): void;

  getOwnerid(): string;
  setOwnerid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFilesByFolderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFilesByFolderRequest): GetFilesByFolderRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetFilesByFolderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFilesByFolderRequest;
  static deserializeBinaryFromReader(message: GetFilesByFolderRequest, reader: jspb.BinaryReader): GetFilesByFolderRequest;
}

export namespace GetFilesByFolderRequest {
  export type AsObject = {
    folderid: string,
    ownerid: string,
  }
}

export class GetFilesByFolderResponse extends jspb.Message {
  clearFilesList(): void;
  getFilesList(): Array<File>;
  setFilesList(value: Array<File>): void;
  addFiles(value?: File, index?: number): File;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFilesByFolderResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFilesByFolderResponse): GetFilesByFolderResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetFilesByFolderResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFilesByFolderResponse;
  static deserializeBinaryFromReader(message: GetFilesByFolderResponse, reader: jspb.BinaryReader): GetFilesByFolderResponse;
}

export namespace GetFilesByFolderResponse {
  export type AsObject = {
    filesList: Array<File.AsObject>,
  }
}

export class CreateFileRequest extends jspb.Message {
  getKey(): string;
  setKey(value: string): void;

  getName(): string;
  setName(value: string): void;

  getSize(): number;
  setSize(value: number): void;

  getType(): string;
  setType(value: string): void;

  getOwnerid(): string;
  setOwnerid(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  getParent(): string;
  setParent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFileRequest): CreateFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFileRequest;
  static deserializeBinaryFromReader(message: CreateFileRequest, reader: jspb.BinaryReader): CreateFileRequest;
}

export namespace CreateFileRequest {
  export type AsObject = {
    key: string,
    name: string,
    size: number,
    type: string,
    ownerid: string,
    bucket: string,
    parent: string,
  }
}

export class DeleteFileRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFileRequest): DeleteFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFileRequest;
  static deserializeBinaryFromReader(message: DeleteFileRequest, reader: jspb.BinaryReader): DeleteFileRequest;
}

export namespace DeleteFileRequest {
  export type AsObject = {
    id: string,
  }
}

export class DeleteFileResponse extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFileResponse): DeleteFileResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteFileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFileResponse;
  static deserializeBinaryFromReader(message: DeleteFileResponse, reader: jspb.BinaryReader): DeleteFileResponse;
}

export namespace DeleteFileResponse {
  export type AsObject = {
    ok: boolean,
  }
}

export class UpdateFileRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getSize(): number;
  setSize(value: number): void;

  getOwnerid(): string;
  setOwnerid(value: string): void;

  getParent(): string;
  setParent(value: string): void;

  getBucket(): string;
  setBucket(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateFileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateFileRequest): UpdateFileRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateFileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateFileRequest;
  static deserializeBinaryFromReader(message: UpdateFileRequest, reader: jspb.BinaryReader): UpdateFileRequest;
}

export namespace UpdateFileRequest {
  export type AsObject = {
    name: string,
    size: number,
    ownerid: string,
    parent: string,
    bucket: string,
  }
}

export class IsAllowedRequest extends jspb.Message {
  getFileid(): string;
  setFileid(value: string): void;

  getUserid(): string;
  setUserid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsAllowedRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsAllowedRequest): IsAllowedRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IsAllowedRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsAllowedRequest;
  static deserializeBinaryFromReader(message: IsAllowedRequest, reader: jspb.BinaryReader): IsAllowedRequest;
}

export namespace IsAllowedRequest {
  export type AsObject = {
    fileid: string,
    userid: string,
  }
}

export class IsAllowedResponse extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsAllowedResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IsAllowedResponse): IsAllowedResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IsAllowedResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsAllowedResponse;
  static deserializeBinaryFromReader(message: IsAllowedResponse, reader: jspb.BinaryReader): IsAllowedResponse;
}

export namespace IsAllowedResponse {
  export type AsObject = {
    allowed: boolean,
  }
}

export class User extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFirstname(): string;
  setFirstname(value: string): void;

  getLastname(): string;
  setLastname(value: string): void;

  getMail(): string;
  setMail(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: string,
    firstname: string,
    lastname: string,
    mail: string,
  }
}

export class App extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): App.AsObject;
  static toObject(includeInstance: boolean, msg: App): App.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: App, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): App;
  static deserializeBinaryFromReader(message: App, reader: jspb.BinaryReader): App;
}

export namespace App {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class File extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  getName(): string;
  setName(value: string): void;

  getType(): string;
  setType(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getOwnerId(): string;
  setOwnerId(value: string): void;

  getSize(): number;
  setSize(value: number): void;

  hasParent(): boolean;
  clearParent(): void;
  getParent(): string;
  setParent(value: string): void;

  hasParentobject(): boolean;
  clearParentobject(): void;
  getParentobject(): File | undefined;
  setParentobject(value?: File): void;

  getBucket(): string;
  setBucket(value: string): void;

  getCreatedat(): number;
  setCreatedat(value: number): void;

  getUpdatedat(): number;
  setUpdatedat(value: number): void;

  getFileoridCase(): File.FileoridCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): File.AsObject;
  static toObject(includeInstance: boolean, msg: File): File.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: File, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): File;
  static deserializeBinaryFromReader(message: File, reader: jspb.BinaryReader): File;
}

export namespace File {
  export type AsObject = {
    id: string,
    key: string,
    name: string,
    type: string,
    description: string,
    ownerId: string,
    size: number,
    parent: string,
    parentobject?: File.AsObject,
    bucket: string,
    createdat: number,
    updatedat: number,
  }

  export enum FileoridCase {
    FILEORID_NOT_SET = 0,
    PARENT = 8,
    PARENTOBJECT = 9,
  }
}

