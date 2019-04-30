import { Types } from 'mongoose';
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
    const objectID = Types.ObjectId();
    const key = this.hashKey(objectID.toHexString());
    return key;
  }

  public static async createUpload(key: string, bucket: string, name: string)
  : Promise<IUpload> {
    const upload: Partial<IUpload> = { key, bucket, name };
    return await UploadRepository.create(upload);
  }

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
    let id: any;

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

  // recursive
  public static async delete(fileId: string): Promise<void> {
    // TODO: Delete all children
    const file: IFile = await this.getById(fileId);
    if (file.type === FolderContentType) {
      const files: IFile[] = await this.getFilesByFolder(file.id, file.ownerID);
      await Promise.all(files.map(file => this.delete(file.id)));
    }
    // delete the file anyways
    await FilesRepository.deleteById(fileId);
    // TODO: Update Parent - necessary?
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
   * @param folderID
   * @param ownerID
   * @param deleted chooses if it would send back the deleted files or not. by default retrieves non-deleted.
   * @returns an array of IFiles within folderID
  */
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null, deleted = false): Promise<IFile[]> {
    let files;

    if (!folderID) { // Search the user's root folder
      if (!ownerID) throw new ClientError('No file or owner id sent');
      const rootFolder = await this.findUserRootFolder(ownerID);
      files = await FilesRepository.find({ deleted, parent: rootFolder });
    } else files = await FilesRepository.find({ deleted, parent: folderID });
    return files;
  }

  public static async isOwner(fileID: string, userID: string): Promise<boolean> {
    const file = await this.getById(fileID);
    return file.ownerID === userID;
  }

  private static async isKeyNotInUse(key: string): Promise<boolean> {
    const fileByKey = await FileService.getByKey(key);
    return fileByKey == null;
  }

  private static async isFileInFolder(fullName: string, folderId: string): Promise<boolean> {
    const file = await FilesRepository.getFileInFolderByName(folderId, fullName);
    return (file != null && file.deleted);
  }

  public static async findUserRootFolder(userID: string, createIfNotExist = false): Promise<IFile | null> {
    const folder = await FilesRepository.getRootFolder(userID);
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
