import { ClientError } from './application.error';

export class IdInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'Id is invalid', 400);
  }
}

export class NameInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'Name is invalid', 400);
  }
}

export class MailInvalidError extends ClientError {
  constructor(message?: string) {
    super(message || 'Mail is invalid', 400);
  }
}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(message || 'File not found', 404);
  }
}

export class KeyAlreadyExistsError extends ClientError {
  constructor(key:string, message?: string) {
    super(message || `The given key ${key} is already in use`, 403);
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(message || 'There is already a file with this name in the folder, try to change the name or the folder', 403);
  }
}
