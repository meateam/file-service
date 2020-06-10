export interface IUpload {
  id?: string;
  uploadID: string;
  key: string;
  bucket: string;
  name: string;
  size: number;
  ownerID: string;
  isUpdate?: boolean;
  fileID?: string;
  parent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
