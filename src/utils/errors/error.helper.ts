import {
  UniqueIndexExistsError,
  FileExistsWithSameName,
  FileIDInvalidError,
  OwnerIDInvalidError,
  ArgumentInvalidError,
  NameInvalidError,
  FileNotFoundError,
  UploadNotFoundError} from './client.error';

export function getDisplayError(error : Error): string {
  switch (error.constructor) {
    case UniqueIndexExistsError:
      return 'this file already exists in the folder (unique index)';
    case FileExistsWithSameName:
      return 'this name already exists';
    case FileIDInvalidError:
      return 'the fileID sent is invalid';
    case OwnerIDInvalidError:
      return 'the ownerID sent is invalid';
    case ArgumentInvalidError:
      return 'argument sent is invalid';
    case NameInvalidError:
      return 'name is invalid';
    case FileNotFoundError:
      return 'file was not found';
    case UploadNotFoundError:
      return 'upload was not found';
    default:
      return 'internal server error';
  }
}
