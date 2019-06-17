import { IUpload } from './upload.interface';
import { uploadModel } from './upload.model';
import { IdInvalidError } from '../utils/errors/client.error';
import { ServerError } from '../utils/errors/application.error';

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the FileService class in file.service.ts .
 */
export class UploadRepository {
  /**
   * Creates a new upload object in the DB.
   * @param upload - the upload to be created.
   */
  static create(upload: Partial<IUpload>): Promise<IUpload> {
    if (!upload) {
      throw new ServerError();
    }
    if (!upload.ownerID) {
      throw new IdInvalidError('ownerID not provided');
    }
    upload.parent = upload.parent ? upload.parent : null;
    return uploadModel.create(upload);
  }

  /**
   * Deletes an upload by its id.
   * @param uploadID - the id of the upload.
   */
  static deleteById(uploadID: string): Promise<IUpload | null> {
    return uploadModel.findOneAndRemove({ uploadID }).exec();
  }

  /**
   * Retrieve an upload by its id.
   * @param uploadID - the id of the upload.
   */
  static getById(uploadID: string): Promise<IUpload | null> {
    return uploadModel.findOne({ uploadID }).exec();
  }

  /**
   * Update the upload ID with the given ID
   * @param key - the key of the upload. is unique with bucket.
   * @param bucket - the bucket of the upload.
   * @param uploadID - the new id.
   */
  static updateByKey(key: string, bucket: string, uploadID: string) : Promise<IUpload> {
    return uploadModel.findOneAndUpdate({ key, bucket }, { uploadID }, { new: true }).exec();
  }

  /**
   * Get all the uploads after a filter.
   * @param filter - an object of upload fields which the results will be filtered by.
   */
  static getMany(filter: Partial<IUpload>): Promise<IUpload[]> {
    return uploadModel.find(filter).exec();
  }
}
