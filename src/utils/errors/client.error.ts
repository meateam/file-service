import { ClientError } from './application.error';
import * as grpc from 'grpc';

/**
 * ArgumentInvalidError is a type of a ClientError, where @code will
 * always be `INVALID_ARGUMENT`. The error will have the problematic
 * argument key & value in it's metadata, and a corresponding message
 * in its details.
 */
export class ArgumentInvalidError extends ClientError {
  /**
   * The constructor of ArgumentInvalidError.
   * @param argumentName The problematic argument's name.
   * @param argumentValue The problematic argument value.
   * @param message An optional custom message.
   */
  constructor(argumentName: string, argumentValue: any, message?: string) {
    const metadata = new grpc.Metadata();
    metadata.add('fieldName', argumentName);
    metadata.add('filedValue', `${argumentValue}`);

    let details = message;
    if (!message) {
      if (!argumentValue) {
        details = `${argumentName} was not provided`;
      } else {
        details = `invalid ${argumentName}: ${argumentValue}`;
      }
    }
    super(
        grpc.status.INVALID_ARGUMENT, details, metadata);
  }
}

/**
 * ArgumentInvalidError is a type of a ClientError, where @argumentName
 * is `fileID`.
 */
export class FileIDInvalidError extends ArgumentInvalidError {
  constructor(message?: string, id?: string) {
    super('fileID', id, message);
  }
}

/**
 * ArgumentInvalidError is a type of a ClientError, where @argumentName
 * is `ownerID`.
 */
export class OwnerIDInvalidError extends ArgumentInvalidError {
  constructor(message?: string, id?: string) {
    super('ownerID', id, message);
  }
}

/**
 * ArgumentInvalidError is a type of a ClientError, where @argumentName
 * is `name`.
 */
export class NameInvalidError extends ArgumentInvalidError {
  constructor(message?: string) {
    super('name', message);
  }
}

/**
 * UniqueIndexExistsError is a type of a ClientError, where @code will
 * always be `ALREADY_EXISTS`. The error will have the problematic object
 * type (like file/upload) as well as the relevant unique index fields
 * and value in it's metadata, and also a corresponding message in its
 * details.
 */
export class UniqueIndexExistsError extends ClientError {
  /**
   * The constructor of ArgumentInvalidError.
   * @param objectType The type of the object.
   * @param uniqueIndexFields list of the unique indexes fields that failed the action.
   * @param uniqueIndexValues list of the unique indexes value that already exists.
   * @param message A custom message
   */
  constructor(objectType:string, uniqueIndexFields: string, uniqueIndexValues: string, message?: string) {
    const metadata = new grpc.Metadata();
    metadata.add('object', objectType);
    metadata.add('indexName', uniqueIndexFields);
    metadata.add('values', uniqueIndexValues);
    super(
        grpc.status.ALREADY_EXISTS,
        message || `unique index duplicate error: The unique index <${uniqueIndexFields}> already has the keys: ${uniqueIndexValues}`,
        metadata,
      );
  }
}

export class FileExistsWithSameName extends ClientError {
  constructor(message?: string) {
    super(grpc.status.ALREADY_EXISTS, message || 'file already exists in the folder');
  }
}

export class ObjectNotFoundError extends ClientError {

}

export class FileNotFoundError extends ClientError {
  constructor(message?: string) {
    super(grpc.status.NOT_FOUND, message || 'file not found');
  }
}

export class UploadNotFoundError extends ClientError {
  constructor(message?: string) {
    super(grpc.status.NOT_FOUND, message || 'upload not found');
  }
}
