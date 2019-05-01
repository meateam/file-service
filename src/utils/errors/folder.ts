/**status
 * The errors that come from the client-side
 */
import { ClientError } from './application.error';

export class FolderError extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'bad folder error', code || 400);
  }
}

export class FolderNotFoundError extends FolderError {
  constructor(message?: string) {
    super(message || 'the folder requested was not found', 404);
  }
}

export class FolderExistsError extends FolderError {
  constructor(message?: string) {
    super(message || 'folder already exists', 409);
  }
}

export class BadIdError extends FolderError {
  constructor(message?: string) {
    super(message || 'bad id provided', 422);
  }
}
