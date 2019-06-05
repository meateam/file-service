/**status
 * The errors that come from the client-side
 */
import { ClientError } from './application.error';

export class FolderError extends ClientError {
  constructor(message?: string, code?: number) {
    super(message || 'invalid folder error', code || 3);
  }
}

export class BadIdError extends FolderError {
  constructor(message?: string) {
    super(message || 'invalid id provided', 3);
  }
}
export class FolderNotFoundError extends FolderError {
  constructor(message?: string) {
    super(message || 'requested folder not found', 5);
  }
}

export class FolderExistsError extends FolderError {
  constructor(message?: string) {
    super(message || 'folder already exists', 6);
  }
}
