import { ClientError } from './application.error';
import * as grpc from 'grpc';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid id', grpc.status.INVALID_ARGUMENT);
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

export class KeyAlreadyExistsError extends ClientError {
  constructor(key:string, message?: string) {
    super(message || `unique key '${key}' is already in use`, grpc.status.INVALID_ARGUMENT);
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
