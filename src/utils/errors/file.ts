/**
 * The errors that come from the client-side
 */
import { ClientError } from './application.error';

export class FileError extends ClientError {
  constructor(message?: string, status?: number) {
    super(message || 'bad file error', status || 400);
  }
}

export class FilesEmpty extends ClientError {
  constructor(message?: string, status?: number) {
    super(message || 'files cannot be empty', status || 400);
  }
}

export class FileNotFoundError extends FileError {
  constructor(message?: string) {
    super(message || 'the file requested was not found', 404);
  }
}

export class FileExistsError extends FileError {
  constructor(message?: string) {
    super(message || 'file already exists', 409);
  }
}

export class BadIdError extends FileError {
  constructor(message?: string) {
    super(message || 'bad id provided', 422);
  }
}

export class DeleteFileError extends FileError {
  constructor(message?: string) {
    super(message || 'file doesnt exist', 404);
  }
}

export class UpdateFileError extends FileError {
  constructor(message?: string) {
    super(message || 'file was not updated', 422);
  }
}
