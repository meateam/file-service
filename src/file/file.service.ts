import { ObjectID } from 'mongodb';
import { IFile } from './file.interface';
import FilesRepository from './file.repository';
import { FileNotFoundError, QueryInvalidError } from '../utils/errors/client.error';
import { ServerError, ClientError } from '../utils/errors/application.error';
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
  public static updateById(fileId: string, partialFile: Partial<IFile>): Promise<boolean> {
    return FilesRepository.updateById(fileId, partialFile);
  }

  /**
   * updateMany updates a list of files.
   * @param files - List of files to update with their updated fields and their id.
   */
  static async updateMany(files: (Partial<IFile> & { id: string })[]): Promise<{updated: string[], failed: { id: string, error: Error }[]}> {
    const failedFiles: { id: string, error: Error }[] = [];
    const updatedFiles: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const updatedFile = await FilesRepository.updateById(files[i].id, files[i]);
        if (updatedFile) {
          updatedFiles.push(files[i].id);
        }
      } catch (e) {
        failedFiles.push({ id: files[i].id, error: e });
      }
    }

    return { updated: updatedFiles, failed: failedFiles };
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
   * @param ownerID - if received root folder (null), get by ownerID.
   * @returns {IFile[]}
  */
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null, queryFile?: Partial<IFile>): Promise<IFile[]> {
    const parent = folderID ? new ObjectID(folderID) : null;
    let query : Partial<IFile> = {};

    // Create the query using the partial file
    for (const prop in queryFile) {
      if (queryFile[prop]) {
        query[prop] = queryFile[prop];
      }
    }

    // Add parent to the query
    query = { ...query, parent };

    if (!ownerID) {
      if (!parent) {
        // If parent is null and there is no ownerID, then the folder can't be found.
        throw new ClientError('No owner id sent');
      } else {
        // Means that parent is root folder of ownerID
        return await FilesRepository.find(query);
      }
    }

    // Add ownerID to the query
    query = Object.assign(query, { ownerID });
    return await FilesRepository.find(query);
  }

  /**
   * Checks if the given file is owned by a specific user.
   * @param fileID - the id of the file.
   * @param userID -the id of the user.
   */
  public static async isOwner(fileID: string, userID: string): Promise<boolean> {
    // If the file is the user's root folder (which he is owner of) - return true
    if (!fileID) {
      return true;
    }
    const file: IFile = await this.getById(fileID);
    return file.ownerID === userID;
  }

  /**
   * Hashes a given key.
   * @param id - the key to be hashed.
   */
  public static hashKey(id: string): string {
    return this.reverseString(id);
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
    return (file != null);
  }

  /**
   * Reverses a given string.
   * @param str - the string to be reversed.
   */
  private static reverseString(str: string): string {
    return str ? str.split('').reverse().join('') : '';
  }
}
