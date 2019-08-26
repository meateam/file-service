import { IQuota } from './quota.interface';
import { quotaModel } from './quota.model';

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the QuotaService class in quota.service.ts .
 */
export class QuotaRepository {
  /**
   * Get the quota by its owner's id.
   * @param ownerID - the id of the quota (same as the one of the owner).
   */
  static getByOwnerID(ownerID: string): Promise<IQuota | null> {
    return quotaModel.findOne({ ownerID }).exec();
  }

  /**
   * Creates a new quota object in the DB.
   * @param quota - the quota to be created.
   */
  static create(quota: Partial<IQuota>): Promise<IQuota | null> {
    return quotaModel.create(quota);
  }

  /**
   * Deletes a quota by its owner's id.
   * @param ownerID - the id of the quota.
   */
  static deleteById(ownerID: string): Promise<IQuota | null> {
    return quotaModel.findOneAndRemove({ ownerID }).exec();
  }

  /**
   * Updates an quota by its owner's id with the given update object.
   * @param ownerID - the id of the owner of the quota.
   * @param update - the updated quota fields.
   */
  static updateById(ownerID: string, update: number): Promise<IQuota | null> {
    return quotaModel.findOneAndUpdate({ ownerID }, { $inc : { used : update } }, { new: true, upsert: true }).exec();
  }
}
