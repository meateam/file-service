import { IUpload } from './upload.interface';
import { uploadModel } from './upload.model';

export class UploadRepository {
  static create(upload: Partial<IUpload>): Promise<IUpload> {
    return uploadModel.create(upload);
  }

  static deleteById(uploadID: string): Promise<IUpload | null> {
    return uploadModel.findOneAndRemove({ uploadID }).exec();
  }

  static getById(uploadID: string): Promise<IUpload | null> {
    return uploadModel.findOne({ uploadID }).exec();
  }

  /**
   * Update the upload ID with the given ID
   * @param key - create a unique with bucket
   * @param newID
   * @param bucket
   */
  static updateByKey(key: string, newID: string, bucket: string) {
    return uploadModel.findOneAndUpdate({ key, bucket }, { uploadID: newID }, { new: true }).exec();
  }
}
