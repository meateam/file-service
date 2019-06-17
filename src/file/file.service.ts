import { ObjectID } from 'mongodb';
import { IFile } from './file.interface';
import FilesRepository from './file.repository';
import { FileExistsWithSameName, FileNotFoundError, UploadNotFoundError } from '../utils/errors/client.error';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { IUpload } from '../upload/upload.interface';
import { UploadRepository } from '../upload/upload.repository';
import { QuotaService } from '../quota/quota.service';
import { fileModel } from './file.model';

export const FolderContentType = 'application/vnd.drive.folder';

/**
 * This server assumes the following:
 * user is a valid existing user.
 * olderID is an objectID of an existing file of type folder.
 */
export class FileService {
  /**
   * Explanation about upload fields:
   * uploadID: the id of the created upload. received from the client (updates later)
   * ucket: also received from the client.
   * key: the key generated.
  */

  /**
   * Generates a random key.
   */
  public static generateKey(): string {
    const objectID : ObjectID = new ObjectID();
    return this.hashKey(objectID.toHexString());
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
  ) : Promise<IUpload> {
    const file = await FilesRepository.getFileInFolderByName(parent, name, ownerID);
    if (file) {
      throw new FileExistsWithSameName();
    }

    const createdUpload = await UploadRepository.create({ key, bucket, name, ownerID, parent, size });
    if (createdUpload) {
      await QuotaService.updateUsed(ownerID, size);
    }

    return createdUpload;
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
   * Creates a file and adds it to the DB.
   * Trusts that the key is unique and that the users exists.
   * @param partialFile - a partial file containing some of the fields.
   * @param name - the name of the file with the extantions.
   * @param ownerID - the id of the file owner.
   * @param type - the type of the file.
   * @param folderID - id of the folder in which the file will reside (in the GUI).
   * @param key - the key of the file.
   * @param size - the size of the file.
   */
  public static async create(
    bucket: string,
    name: string,
    ownerID: string,
    type: string,
    folderID: string = '',
    key: string = '',
    size: number = 0,
  ): Promise<IFile> {
    const isFolder: boolean = (type === FolderContentType);
    if (!key && !isFolder) {
      throw new ServerError('No key sent');
    }

    let id: string | ObjectID = new ObjectID();

    // Create the file id by reversing key.
    if (key) {
      id = this.reverseString(key);
    }

    // If there is no parent given, create the file in the user's root folder.
    const parentID: string = folderID;

    const file: IFile = new fileModel({
      bucket,
      key,
      type,
      name,
      ownerID,
      size,
      _id: id,
      deleted: false,
      parent: parentID,
    });

    const createdFile = await FilesRepository.create(file);
    if (createdFile) {
      await QuotaService.updateUsed(ownerID, size);
    }

    return createdFile;
  }

  /**
   * If receiving a file, deletes the file.
   * If receiving a folder:
   * Recursively delete all files and sub-folders in the given folder,
   * only then delete the folder.
   * @param fileId - the id of the file/folder
   */
  public static async delete(fileId: string): Promise<void> {
    const file: IFile = await this.getById(fileId);
    if (file.type === FolderContentType) {
      const files: IFile[] = await this.getFilesByFolder(file.id, file.ownerID);
      await Promise.all(files.map(file => this.delete(file.id)));
    }
    await FilesRepository.deleteById(fileId);
  }

  /**
   * Update a file using a partial file containing some of the fields.
   * @param fileId - the id of the file.
   * @param partialFile - the partial file.
   */
  public static updateById(fileId: string, partialFile: Partial<IFile>): Promise<IFile> {
    return FilesRepository.updateById(fileId, partialFile);
  }

  /**
   * Get a file by its id.
   * @param fileId - the id of the file.
   */
  public static async getById(fileId: string): Promise<IFile> {
    const file = await FilesRepository.getById(fileId);
    if (!file) throw new FileNotFoundError();
    return file;
  }

  /**
   * Get a file by its key.
   * @param key - the key of the file. unique.
   */
  public static async getByKey(key: string): Promise<IFile> {
    const file = await FilesRepository.getByKey(key);
    if (!file) throw new FileNotFoundError();
    return file;
  }

  /**
   * Gets all the files in a folder by the folder id.
   * @param folderID -the given folder.
   * @param ownerID - for permissions check.
   * @param deleted chooses if it would send back the deleted files or not. by default retrieves non-deleted.
   * @returns {IFile[]}
  */
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null, deleted = false): Promise<IFile[]> {
    if (!ownerID) throw new ClientError('No owner id sent');
    const parent = folderID ? new ObjectID(folderID) : null;
    return await FilesRepository.find({ deleted, ownerID, parent });
  }

  /**
   * Checks if the given file is owned by a specific user.
   * @param fileID - the id of the file.
   * @param userID -the id of the user.
   */
  public static async isOwner(fileID: string, userID: string): Promise<boolean> {
    // if the file is the user's root folder (which he is owner of) - return true
    if (!fileID) {
      return true;
    }
    const file: IFile = await this.getById(fileID);
    return file.ownerID === userID;
  }

  /**
   * Makes sure a key is not in use in the database, to preserve uniqueness.
   * @param key - the key to check.
   */
  private static async isKeyNotInUse(key: string): Promise<boolean> {
    const fileByKey: IFile = await FileService.getByKey(key);
    return fileByKey == null;
  }

  /**
   * Checks if there is a file with a given name in a given filder.
   * @param name - the name of the file.
   * @param folderId - the id of the folder.
   */
  private static async isFileInFolder(name: string, folderId: string, ownerID: string): Promise<boolean> {
    const file: IFile = await FilesRepository.getFileInFolderByName(folderId, name, ownerID);
    return (file != null && !(file.deleted));
  }

  /**
   * Hashes a given key.
   * @param id - the key to be hashed.
   */
  public static hashKey(id: string): string {
    return this.reverseString(id);
  }

  /**
   * Reverses a given string.
   * @param str - the string to be reversed.
   */
  private static reverseString(str: string): string {
    return str ? str.split('').reverse().join('') : '';
  }
}
