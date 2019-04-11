import { IFile } from './file.interface';
import FilesRepository from './file.repository';
import { KeyAlreadyExistsError, FileExistsWithSameName, FileNotFoundError } from '../utils/errors/client.error';
import { Types } from 'mongoose';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { fileModel } from './file.model';

// This server assumes the following:
// user is a valid existing user.
// folderID is an objectID of an existing file of type folder.
export class FileService {

  public static generateKey(): string {
    const key = Types.ObjectId();
    return this.hashKey(key.toHexString());
  }

  // Trusts that the key is unique and that the users exists.
  public static async create(
    partialFile: Partial<IFile>,
    fullName: string, ownerID: string,
    type: string, folderID: string = null,
    key: string = null
  ): Promise<IFile> {

    const isFolder = (type === 'Folder');
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
      parent: parentID
    });

    return await FilesRepository.create(file);
  }

  public static async delete(fileId: string): Promise<void> {
    // TODO: Delete all children
    await FilesRepository.deleteById(fileId);
    // TODO: Update Parent
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

  // public static async getFolderContent(folderID: string): Promise<IFile[]> {
  //   if (!folderID) { // Search the user's root folder
  //     if (!ownerID) throw new ClientError('No file or owner id sent');
  //     const rootFolder = await this.findUserRootFolder(ownerID);
  //     if (!rootFolder) return [];
  //     const files = await FilesRepository.find({ parent: rootFolder });
  //     return files;
  //   }
  //   const files = await FilesRepository.find({ parent: folderID });
  //   return files;
  // }

  // TODO
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null): Promise<any> {
    let files;
    if (!folderID) { // Search the user's root folder
      if (!ownerID) throw new ClientError('No file or owner id sent');
      const rootFolder = await this.findUserRootFolder(ownerID);
      files = await FilesRepository.find({ parent: rootFolder });
    } else files = await FilesRepository.find({ parent: folderID });
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
    return file != null;
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
      type: 'Folder',
      key: null,
      bucket: userID,
      fullName: userID,
      ownerID: userID,
      isRootFolder: true,
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
