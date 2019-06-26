export interface IQuota {
  ownerID: string;
  limit: number;
  used: number;
  createdAt?: Date;
  updatedAt?: Date;
}
