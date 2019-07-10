// The quota id is the same as the ownerID - since an owner can only have one quota.
export interface IQuota {
  ownerID: string;
  limit: number;
  used: number;
  createdAt?: Date;
  updatedAt?: Date;
}
