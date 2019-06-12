export interface IBucket {
  bucketID: string;
  ownerID: string;
  quota: number;
  used: number;
  createdAt?: Date;
  updatedAt?: Date;
}
