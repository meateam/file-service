import { IFile } from './file.interface';
import FilesRepository from './file.repository';
import { KeyAlreadyExistsError, FileExistsWithSameName } from '../errors/client.error';
import { Types } from 'mongoose';
import { ServerError } from '../errors/application.error';

// This server assumes a user exists if sent
export class FileService {

  public static generateKey(): string {
    const key = Types.ObjectId();
    return this.hashKey(key.toHexString());
  }

  // Trusts that the key is unique and that the users exists.
  public static async create(
    partialFile: Partial<File>,
    fullName: string, ownerID: string,
    type:string, folderID:string = null,
    key: string = null
  ): Promise<IFile> {

    console.log('Hello???');

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

    console.log(file);

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

  public static getById(fileId: string): Promise<IFile> {
    return FilesRepository.getById(fileId);
  }

  public static getByKey(key: string): Promise<IFile> {
    return FilesRepository.getByKey(key);
  }

  public static async getFolderContent(folderID: string): Promise<IFile[]> {
    const files = await FilesRepository.find({ parent: folderID });
    return <IFile[]> files;
  }

  private static async isKeyNotInUse(key: string): Promise<boolean> {
    const fileByKey = await FileService.getByKey(key);
    return fileByKey == null;
  }

  private static async isFileInFolder(fullName: string, folderId: string): Promise<boolean> {
    const file = await FilesRepository.getFileInFolderByName(folderId, fullName);
    return file != null;
  }

  private static async findUserRootFolder(userID: string, createIfNotExist = false): Promise<IFile | null> {
    const folder = await FilesRepository.getRootFolder(userID);
    if (!folder && createIfNotExist) {
      return await this.createUserRootFolder(userID);
    }
    return folder;
  }
  private static async createUserRootFolder(userID: string): Promise<IFile> {
    const folder: IFile = {
      type: 'Folder',
      fullName: userID,
      ownerID: userID,
      isRootFolder: true,
    };
    return await FilesRepository.create(folder);
  }
  // Reversing a given string
  private static hashKey(id: string): string {
    return this.reverseString(id);
  }
  private static reverseString(str: string): string {
    return str.split('').reverse().join('');
  }
}
