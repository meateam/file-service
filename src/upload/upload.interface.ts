export interface IUpload {
  id?: string;
  uploadID: string;
  key: string;
  bucket: string;
  name: string;
  ownerID?: string;
  parent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
