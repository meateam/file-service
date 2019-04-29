export interface IUpload {
  id?: string;          // mongoId
  uploadID: string;
  key: string;
  bucket: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
