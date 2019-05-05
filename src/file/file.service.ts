import { Types } from 'mongoose';
import { ObjectID } from 'mongodb';
import { IFile } from './file.interface';
import FilesRepository from './file.repository';
import { FileExistsWithSameName, FileNotFoundError, UploadNotFoundError } from '../utils/errors/client.error';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { IUpload } from './upload.interface';
import { UploadRepository } from './upload.repository';

export const FolderContentType = 'application/vnd.drive.folder';

// This server assumes the following:
// user is a valid existing user.
// folderID is an objectID of an existing file of type folder.
export class FileService {
  // Explanation about upload fields:
  // uploadID: the id of the created upload. received from the client (updates later)
  // bucket: also received from the client.
  // key: the key generated.
  public static generateKey(): string {
    const objectID : ObjectID = Types.ObjectId();
    return this.hashKey(objectID.toHexString());
  }

  /**
   * @param key - generated with generateKey
   * @param bucket - is the s3 bucket in the storage
   * @param name - of the file uploaded
   */
  public static async createUpload(key: string, bucket: string, name: string)
  : Promise<IUpload> {
    const upload: Partial<IUpload> = { key, bucket, name };
    return await UploadRepository.create(upload);
  }

  /**
   * @param uploadID - the new id of the upload
   * @param key - of the upload
   * @param bucket - together with bucket, create a unique identifier
   */
  public static async updateUpload(uploadID: string, key: string, bucket: string) {
    return await UploadRepository.updateByKey(key, uploadID, bucket);
  }

  public static async getUploadById(uploadID: string): Promise<IUpload> {
    const upload = await UploadRepository.getById(uploadID);
    if (!upload) throw new UploadNotFoundError();
    return upload;
  }

  public static async deleteUpload(fileId: string): Promise<void> {
    await UploadRepository.deleteById(fileId);
  }

  // Trusts that the key is unique and that the users exists.
  public static async create(
    partialFile: Partial<IFile>,
    fullName: string, ownerID: string,
    type: string, folderID: string = null,
    key: string = null
  ): Promise<IFile> {

    const isFolder = (type === FolderContentType);
    let id: string | ObjectID;

    // Create the file id (from key or new one).
    if (key) { // if key exists reverse it to get the generated id
      id = this.reverseString(key);
    } else {
      if (!isFolder) {
        throw new ServerError('No key sent');
      }
      id = Types.ObjectId();
    }

    let parentID: string = folderID;
    if (!parentID) { // If there is not parent given, create the file in the user's root folder
      const rootFolder: IFile = await this.findUserRootFolder(ownerID, true); // Creates one if not exists
      parentID = rootFolder.id;
    }

    if (await this.isFileInFolder(fullName, parentID)) {
      throw new FileExistsWithSameName();
    }
    const file: IFile = Object.assign(partialFile, {
      key,
      type,
      fullName,
      ownerID,
      _id: id,
      deleted: false,
      parent: parentID
    });

    return await FilesRepository.create(file);
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

  public static updateById(fileId: string, file: Partial<IFile>): Promise<IFile> {
    return FilesRepository.updateById(fileId, file);
  }

  public static async getById(fileId: string): Promise<IFile> {
    const file = await FilesRepository.getById(fileId);
    if (!file) throw new FileNotFoundError();
    return file;
  }

  public static async getByKey(key: string): Promise<IFile> {
    const file = await FilesRepository.getByKey(key);
    if (!file) throw new FileNotFoundError();
    return file;
  }

  /**
   * @param folderID -the given folder.
   * @param ownerID - for permissions check.
   * @param deleted chooses if it would send back the deleted files or not. by default retrieves non-deleted.
   * @returns {IFile[]}
  */
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null, deleted = false): Promise<IFile[]> {
    let files: IFile[];
    if (!folderID) { // Search the user's root folder
      if (!ownerID) throw new ClientError('No file or owner id sent');
      const rootFolder = await this.findUserRootFolder(ownerID);
      files = await FilesRepository.find({ deleted, parent: rootFolder });
    } else files = await FilesRepository.find({ deleted, parent: folderID });

    return files;
  }

  public static async isOwner(fileID: string, userID: string): Promise<boolean> {
    const file: IFile = await this.getById(fileID);
    return file.ownerID === userID;
  }

  private static async isKeyNotInUse(key: string): Promise<boolean> {
    const fileByKey: IFile = await FileService.getByKey(key);
    return fileByKey == null;
  }

  private static async isFileInFolder(fullName: string, folderId: string): Promise<boolean> {
    const file: IFile = await FilesRepository.getFileInFolderByName(folderId, fullName);
    return (file != null && !(file.deleted));
  }

  public static async findUserRootFolder(userID: string, createIfNotExist = false): Promise<IFile | null> {
    const folder: IFile = await FilesRepository.getRootFolder(userID);
    if (!folder && createIfNotExist) {
      return await this.createUserRootFolder(userID);
    }

    return folder;
  }

  private static async createUserRootFolder(userID: string): Promise<IFile> {
    const folder: IFile = {
      type: FolderContentType,
      key: null,
      bucket: userID,
      fullName: userID,
      ownerID: userID,
      isRootFolder: true,
      deleted: false,
    };

    return await FilesRepository.create(folder);
  }

  // Reversing a given string
  public static hashKey(id: string): string {
    return this.reverseString(id);
  }

  private static reverseString(str: string): string {
    return str.split('').reverse().join('');
  }
}
