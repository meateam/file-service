import { QuotaRepository } from './quota.repository';
import { IQuota } from './quota.interface';
import { QuotaExceededError } from '../utils/errors/quota.error';
import { ServerError } from '../utils/errors/application.error';

export class QuotaService {
  /**
   * Returns the quota of a user by his ID.
   * @param ownerID - the user id.
   */
  public static async getByOwnerID(ownerID: string): Promise<IQuota> {
    let quota: IQuota = await QuotaRepository.getByOwnerID(ownerID);

    // Create quota if it doesn't exist.
    if (!quota) {
      quota = await this.create(ownerID);
    }

    return quota;
  }

  /**
   * Creates a quota given the userID.
   * default: 100GB per user.
   * @param ownerID - the user ID.
   */
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
    const quota: IQuota = await this.getByOwnerID(ownerID);
    if (Number(quota.used) + Number(change) < 0) {
      throw new ServerError('negative used quota');
    }

    if (quota.used + change > quota.limit) {
      throw new QuotaExceededError();
    }

    return QuotaRepository.updateById(ownerID, change);
  }

  /**
   * Checks if the user is allowed to access the owner's quota.
   * @param requestingUser - the requesting user id.
   * @param ownerID - the owner id.
   */
  public static isAllowedToGetQuota(requestingUser: string, ownerID: string) {
    return ownerID === requestingUser;
  }
}
