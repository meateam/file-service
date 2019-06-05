/**
 * The errors that come from the client-side
 */
import { ClientError } from './application.error';

export class FileError extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'invalid file error', code || 3);
  }
}

export class FilesEmpty extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'files cannot be empty', code || 3);
  }
}

export class BadIdError extends FileError {
  constructor(message?: string) {
    super(message || 'invalid id provided', 3);
  }
}

export class DeleteFileError extends FileError {
  constructor(message?: string) {
    super(message || "file doesn't exist", 5);
  }
}

export class FileNotFoundError extends FileError {
  constructor(message?: string) {
    super(message || 'the file requested was not found', 5);
  }
}

export class FileExistsError extends FileError {
  constructor(message?: string) {
    super(message || 'file already exists', 6);
  }
}

export class UpdateFileError extends FileError {
  constructor(message?: string) {
    super(message || 'file was not updated', 9);
  }
}
