import { IFile } from './files.interface';
import FilesRepository from './files.repository';
import { KeyAlreadyExistsError, FileExistsWithSameName } from '../errors/client.error';
import { Types } from 'mongoose';

// This server assumes a user exists if sent
export class FileService {

  public static async create(partialFile: Partial<File>, fullName: string, ownerID: string, folderID:string = null, isFolder:boolean = false, key: string = null): Promise<IFile> {

    let type: string = null;
    if (!isFolder) {
      if (!key) {
        const key = Types.ObjectId();
      }
      // Checks that the key is unique
      if (await this.isKeyNotInUse(key)) {
        throw new KeyAlreadyExistsError(key);
      }
      type = 'Blob';
    } else {
      type = 'Folder';
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
      fullName,
      type,
      ownerID,
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

  public static getById(fileId: string): Promise<IFile> {
    return FilesRepository.getById(fileId);
  }

  public static getByKey(key: string): Promise<IFile> {
    return FilesRepository.getByKey(key);
  }

  private static async isKeyNotInUse(key: string): Promise<boolean> {
    const fileByKey = await FileService.getByKey(key);
    return fileByKey == null;
  }

  private static async isFileInFolder(fullName: string, folderId: string): Promise<boolean> {
    const file = await FilesRepository.getFileInFolderByName(folderId, fullName);
    return file == null;
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
}
