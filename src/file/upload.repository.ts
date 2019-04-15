import { IUpload } from './upload.interface';
import { uploadSchema, uploadModel } from './upload.model';

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

  static updateByKey(key: string, newID: string, bucket: string) {
    return uploadModel.findOneAndUpdate({ key, bucket }, { uploadID: newID }, { new: true }).exec();
  }
}
