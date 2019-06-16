import { IBucket } from './bucket.interface';
import { bucketModel } from './bucket.model';

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the BucketService class in bucket.service.ts .
 */
export class BucketRepository {
  /**
   * Get the bucket by its id.
   * @param ownerID - the id of the bucket.
   */
  static getByOwnerID(ownerID: string): Promise<IBucket | null> {
    return bucketModel.findOne({ ownerID }).exec();
  }

  /**
   * Creates a new bucket object in the DB.
   * @param bucket - the bucket to be created.
   */
  static create(bucket: Partial<IBucket>): Promise<IBucket> {
    return bucketModel.create(bucket);
  }

  /**
   * Deletes an bucket by its id.
   * @param ownerID - the id of the bucket.
   */
  static deleteById(ownerID: string): Promise<IBucket | null> {
    return bucketModel.findOneAndRemove({ ownerID }).exec();
  }

  /**
   * Updates an bucket by its id with the given update object.
   * @param ownerID - the id of the bucket.
   * @param update - the updated bucket fields.
   */
  static updateById(ownerID: string, update: Partial<IBucket>): Promise<IBucket | null> {
    return bucketModel.findOneAndUpdate({ ownerID }, update, { new: true, upsert: true }).exec();
  }
}
