import { QuotaRepository } from './quota.repository';
import { IQuota } from './quota.interface';
import { QuotaExceededError } from '../utils/errors/quota.error';
import { ServerError } from '../utils/errors/application.error';

export class QuotaService {
  public static async getByOwnerID(ownerID: string): Promise<IQuota> {
    let quota = await QuotaRepository.getByOwnerID(ownerID);

    // Create quota if it doesn't exist.
    if (!quota) {
      quota = await this.create(ownerID);
    }

    return quota;
  }
  public static create(ownerID: string): Promise<IQuota> {
    return QuotaRepository.create({ ownerID });
  }

  /**
   * Updates the used size of the quota by the given change.
   * @param ownerID - the id of the quota to update.
   * @param change - the change in used size of the quota in bytes,
   * 	if change is positive then the used field is increased,
   * 	if change is negative then the used field is decreased.
   */
  public static async updateUsed(ownerID: string, change: number) {
    const quota = await this.getByOwnerID(ownerID);
    if (quota.used + change < 0) {
      throw new ServerError('negative used quota');
    }

    if (quota.used + change > quota.limit) {
      throw new QuotaExceededError();
    }

    return QuotaRepository.updateById(ownerID, { used: quota.used + change });
  }
}
