import { ClientError } from './application.error';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'INVALID_ARGUMENT: id is invalid', 3);
  }
}

export class NameInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'INVALID_ARGUMENT: name is invalid', 3);
  }
}

export class MailInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'INVALID_ARGUMENT: mail is invalid', 3);
  }
}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'NOT_FOUND: file not found', 5);
  }
}

export class UploadNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'NOT_FOUND: upload not found', 5);
  }
}

export class KeyAlreadyExistsError extends ClientError {
  constructor(key:string, message?: string) {
    super(message || `INVALID_ARGUMENT: the given key ${key} is already in use`, 3);
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(message || 'INVALID_ARGUMENT: there is already a file with this name in the folder, try to change the name or the folder', 3);
  }
}
