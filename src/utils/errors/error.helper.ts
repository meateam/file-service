import {
  UniqueIndexExistsError,
  FileExistsWithSameName,
  IdInvalidError,
  ArgumentInvalidError,
  NameInvalidError,
  MailInvalidError,
  QueryInvalidError,
  FileNotFoundError,
  UploadNotFoundError} from './client.error';

export function getDisplayError(error : Error): string {
  switch (error.constructor) {
    case UniqueIndexExistsError:
      return 'this file already exists in the folder (unique index)';
    case FileExistsWithSameName:
      return 'this name already exists';
    case IdInvalidError:
      return 'the id sent is invalid';
    case ArgumentInvalidError:
      return 'argument sent is invalid';
    case NameInvalidError:
      return 'this name is invalid';
    case MailInvalidError:
      return 'mail is invalid';
    case QueryInvalidError:
      return 'query sent is invalid';
    case FileNotFoundError:
      return 'file was not found';
    case UploadNotFoundError:
      return 'upload was not found';
    default:
      return 'internal server error';
  }
}
