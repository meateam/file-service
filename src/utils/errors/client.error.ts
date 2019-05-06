import { ClientError } from './application.error';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'id is invalid', 400);
  }
}

export class NameInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'name is invalid', 400);
  }
}

export class MailInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'mail is invalid', 400);
  }
}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'file not found', 404);
  }
}

export class UploadNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'upload not found', 404);
  }
}

export class KeyAlreadyExistsError extends ClientError {
  constructor(key:string, message?: string) {
    super(message || `the given key ${key} is already in use`, 403);
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(message || 'there is already a file with this name in the folder, try to change the name or the folder', 403);
  }
}
