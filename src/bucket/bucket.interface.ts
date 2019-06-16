export interface IBucket {
  ownerID: string;
  quota: number;
  used: number;
  createdAt?: Date;
  updatedAt?: Date;
}
