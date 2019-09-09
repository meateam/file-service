import { UniqueIndexExistsError, FileExistsWithSameName } from './client.error';

export function getDisplayError(error : Error): string {
  switch (error.constructor) {
    case UniqueIndexExistsError:
      return 'this name already exists';
    case FileExistsWithSameName:
      return 'this name already exists';
    default:
      return '';
  }
}
