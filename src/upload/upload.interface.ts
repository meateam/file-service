export interface IUpload {
  id?: string;
  uploadID: string;
  key: string;
  bucket: string;
  name: string;
  size: number;
  ownerID: string;
  isUpdate?: boolean; // Relevant for updates
  fileID?: string; // Relevant for updates
  parent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
