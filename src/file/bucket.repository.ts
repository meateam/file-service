import { IBucket } from './bucket.interface';
import { bucketModel } from './bucket.model';

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the FileService class in file.service.ts .
 */
export class UploadRepository {
  /**
   * Creates a new bucket object in the DB.
   * @param bucket - the bucket to be created.
   */
  static create(bucket: Partial<IBucket>): Promise<IBucket> {
    return bucketModel.create(bucket);
  }

  /**
   * Deletes an bucket by its id.
   * @param bucketID - the id of the bucket.
   */
  static deleteById(bucketID: string): Promise<IBucket | null> {
    return bucketModel.findOneAndRemove({ bucketID }).exec();
  }

}
