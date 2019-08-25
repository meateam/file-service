import { ClientError } from './application.error';
import * as grpc from 'grpc';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid id', grpc.status.INVALID_ARGUMENT);
  }
}

export class ArgumentInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid argument', grpc.status.INVALID_ARGUMENT);
  }
}

export class NameInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid name', grpc.status.INVALID_ARGUMENT);
  }
}

export class MailInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid mail', grpc.status.INVALID_ARGUMENT);
  }
}

export class QueryInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid JSON query', grpc.status.INVALID_ARGUMENT);
  }
}

export class UniqueIndexExistsError extends ClientError {
  constructor(uniqueIndex:string, message?: string) {
    super(message || `unique index '${uniqueIndex}' is already in use`, grpc.status.INVALID_ARGUMENT);
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(message || 'file already exists in the folder', grpc.status.INVALID_ARGUMENT);
  }
}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'file not found', grpc.status.NOT_FOUND);
  }
}

export class UploadNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'upload not found', grpc.status.NOT_FOUND);
  }
}
