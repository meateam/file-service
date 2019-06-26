import { ClientError } from './application.error';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid id', 3);
  }
}

export class NameInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid name', 3);
  }
}

export class MailInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'invalid mail', 3);
  }
}

export class KeyAlreadyExistsError extends ClientError {
  constructor(key:string, message?: string) {
    super(message || `key: ${key} is already in use`, 3);
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(message || 'file already exists in the folder', 3);
  }
}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'file not found', 5);
  }
}

export class UploadNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'upload not found', 5);
  }
}
