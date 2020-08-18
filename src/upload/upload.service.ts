import { ObjectID } from 'mongodb';
import FilesRepository from '../file/file.repository';
import { FileExistsWithSameName, UploadNotFoundError, FileNotFoundError } from '../utils/errors/client.error';
import { IUpload } from '../upload/upload.interface';
import { UploadRepository } from '../upload/upload.repository';
import { QuotaService } from '../quota/quota.service';
import { IFile } from '../file/file.interface';

/**
 * Explanation about upload fields:
 * uploadID: the id of the created upload. received from the client (updates later)
 * bucket: also received from the client.
 * key: the key generated.
 */
export class UploadService {

  /**
   * Generates a random key.
   */
  public static generateKey(): string {
    const objectID: ObjectID = new ObjectID();
    return this.reverseString(objectID.toHexString());
  }

  /**
   * Creates a new upload object and adds it to the DB.
   * @param key - generated with generateKey
   * @param bucket - is the s3 bucket in the storage
   * @param name - of the file uploaded
   * @param ownerID - the id of the file owner
   * @param parent - the folder id in which the file resides
   * @param size - the size of the file that is being uploaded.
   */
  public static async createUpload(
    key: string,
    bucket: string,
    name: string,
    ownerID: string,
    parent: string,
    size: number = 0,
  ): Promise<IUpload> {
    const file = await FilesRepository.getFileInFolderByName(parent, name, ownerID);
    if (file) {
      throw new FileExistsWithSameName();
    }

    const createdUpload = await UploadRepository.create({ key, bucket, name, ownerID, parent, size, isUpdate: false });
    if (createdUpload) {
      await QuotaService.updateUsed(ownerID, size);
    }

    return createdUpload;
  }

  /**
   * Creates a new upload object and adds it to the DB for update file. // TODO
   * @param key - file key
   * @param bucket - is the s3 bucket in the storage
   * @param name - of the file uploaded
   * @param ownerID - the id of the file owner
   * @param parent - the folder id in which the file resides
   * @param size - the size of the file that is being uploaded.
   */
  public static async createUpdate(
    key: string,
    bucket: string,
    name: string,
    ownerID: string,
    parent: string,
    size: number = 0,
  ): Promise<IUpload> {

    const file: IFile = await FilesRepository.getFileInFolderByName(parent, name, ownerID);
    if (!file) {
      throw new FileNotFoundError();
    }

    // Checks whether the new file is larger than the existing file,
    // if it is greater then save the difference
    const sizeCalculated: number = (file.size < size) ? size - file.size : 0;

    const upload: IUpload = await UploadRepository.create({ key, bucket, name, ownerID, parent, size: sizeCalculated, isUpdate: true, fileID: file.id });

    if (upload && sizeCalculated > 0) {
      await QuotaService.updateUsed(ownerID, sizeCalculated);
    }
    return upload;
  }

  /**
	 * Updated the upload ID.
	 * @param uploadID - the new id of the upload
	 * @param key - of the upload
	 * @param bucket - together with bucket, create a unique identifier
	 */
  public static async updateUpload(
    uploadID: string,
    key: string,
    bucket: string,
  ): Promise<IUpload> {
    return await UploadRepository.updateByKey(key, bucket, uploadID);
  }

  /**
   * Retrieves the upload object from the DB by its id.
   * @param uploadID - the id of the upload.
   */
  public static async getUploadById(uploadID: string): Promise<IUpload> {
    const upload = await UploadRepository.getById(uploadID);
    if (!upload) throw new UploadNotFoundError();
    return upload;
  }

  /**
   * deletes an upload by its id.
   * @param uploadId - the id of the upload.
   */
  public static async deleteUpload(uploadId: string): Promise<void> {
    const deletedUpload = await UploadRepository.deleteById(uploadId);
    if (deletedUpload) {
      await QuotaService.updateUsed(deletedUpload.ownerID, -deletedUpload.size);
    }
  }

  /**
   * Reverses a given string.
   * @param str - the string to be reversed.
   */
  private static reverseString(str: string): string {
    return str ? str.split('').reverse().join('') : '';
  }
}
