/**
 * The errors that come from the client-side
 */
import { ClientError } from './application.error';

export class FileError extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'INVALID_ARGUMENT: bad file error', code || 3);
  }
}

export class FilesEmpty extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'INVALID_ARGUMENT: files cannot be empty', code || 3);
  }
}

export class FileNotFoundError extends FileError {
  constructor(message?: string) {
    super(message || 'NOT_FOUND: the file requested was not found', 5);
  }
}

export class FileExistsError extends FileError {
  constructor(message?: string) {
    super(message || 'ALREADY_EXISTS: file already exists', 6);
  }
}

export class BadIdError extends FileError {
  constructor(message?: string) {
    super(message || 'INVALID_ARGUMENT: bad id provided', 3);
  }
}

export class DeleteFileError extends FileError {
  constructor(message?: string) {
    super(message || "NOT_FOUND: file doesn't exist", 5);
  }
}

export class UpdateFileError extends FileError {
  constructor(message?: string) {
    super(message || 'FAILED_PRECONDITION: file was not updated', 9);
  }
}
