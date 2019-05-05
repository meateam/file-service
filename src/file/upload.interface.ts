export interface IUpload {
  id?: string;
  uploadID: string;
  key: string;
  bucket: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
