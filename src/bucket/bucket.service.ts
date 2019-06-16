import { BucketRepository } from './bucket.repository';
import { IBucket } from './bucket.interface';
import { BucketQuotaExceededError } from '../utils/errors/bucket.error';

export class BucketService {
  public static getByOwnerID(ownerID: string): Promise<IBucket> {
    return BucketRepository.getByOwnerID(ownerID);
  }
  public static create(ownerID: string): Promise<IBucket> {
    return BucketRepository.create({ ownerID });
  }

  /**
   * Updates the used size of the bucket by the given change.
   * @param ownerID - the id of the bucket to update.
   * @param change - the change in used size of the bucket,
   * 	if change is positive then the used field is increased,
   * 	if change is negative then the used field is decreased.
   */
  public static async updateUsed(ownerID: string, change: number) {
    const bucket = await BucketRepository.getByOwnerID(ownerID);
    if (bucket.used + change > bucket.quota) {
      throw new BucketQuotaExceededError();
    }

    return BucketRepository.updateById(ownerID, { used: bucket.used + change });
  }
}
