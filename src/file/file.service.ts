import { ObjectID } from 'mongodb';
import { IFile, ResFile } from './file.interface';
import FilesRepository from './file.repository';
import { FileNotFoundError, QueryInvalidError } from '../utils/errors/client.error';
import { ServerError, ClientError } from '../utils/errors/application.error';
import { QuotaService } from '../quota/quota.service';
import { fileModel } from './file.model';

export const FolderContentType = 'application/vnd.drive.folder';

type NestedIFileArray = IFile | IFileArray;

interface IFileArray extends Array<NestedIFileArray> { }

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
    bucket: string| null = null,
    name: string,
    ownerID: string,
    type: string,
    folderID: string = '',
    key: string | null = null,
    size: number = 0,
  ): Promise<IFile> {
    const isFolder: boolean = (type === FolderContentType);
    if (!key && !isFolder) {
      throw new ServerError('No key sent');
    }

    // basicFile is without key and bucket - in case it is a folder.
    let basicFile: IFile = {
      type,
      name,
      ownerID,
      size,
      parent: folderID
    };

    // Create the file id by reversing key, and add ket and bucket.
    if (key && bucket) {
      basicFile = { ...basicFile, bucket, key };
    }

    const file: IFile = new fileModel(basicFile);

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
  static async updateMany(idList: string[], partialFile: Partial<IFile>): Promise<{updated: string[], failed: { id: string, error: Error }[]}> {
    const failedFiles: { id: string, error: Error }[] = [];
    const updatedFiles: string[] = [];
    for (let i = 0; i < idList.length; i++) {
      try {
        const updatedFile = await FilesRepository.updateById(idList[i], partialFile);
        if (updatedFile) {
          updatedFiles.push(idList[i]);
        }
      } catch (e) {
        failedFiles.push({ id: idList[i], error: e });
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
   * @param queryFile - the partial file containing the conditions.
   * @returns an array of IFile: the children of the given folder, following the condition.
  */
  public static async getFilesByFolder(folderID: string | null, ownerID: string | null, queryFile?: Partial<IFile>): Promise<IFile[]> {
    const parent = folderID ? new ObjectID(folderID) : null;
    let query : Partial<IFile> = this.extractQuery(queryFile);
    // Add parent to the query
    query = { ...query, parent };
    if (!ownerID) {
      if (!parent) {
        // If parent is null and there is no ownerID, then the folder can't be found.
        throw new ClientError('no owner id sent');
      }
    } else {
      // Add ownerID to the query
      query = { ...query, ownerID };
    }

    return await FilesRepository.find(query);
  }

  /**
   * Recursively extracts all descendants of a folder with given conditions.
   * @param folderID - the ancestor folder.
   * @param ownerID - owner of said folder.
   * @param queryFile - the partial file creating the conditions.
   * @returns a nested IFile array of the descendants.
   */
  public static async getDescendantsByFolder
  (folderID: string | null, ownerID: string | null, queryFile?: Partial<IFile>): Promise<ResFile[]> {
    const query : Partial<IFile> = this.extractQuery(queryFile);
    const children: ResFile[] = await this.getPopulatedChildren(folderID, ownerID, query);
    return children;
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

  /**
   * Auxillary function for getFilesByFolder and getDescendantsByFolder.
   * Creates the query using the partial file,
   * and removes empty properties, indicated as default values
   * @param queryFile - the partial file containing the conditions.
   * @returns the pure query for extracting from the database.
   */
  private static extractQuery(queryFile?: Partial<IFile>): Partial<IFile> {
    const query : Partial<IFile> = {};
    for (const prop in queryFile) {
      if (queryFile[prop]) {
        query[prop] = queryFile[prop];
      }
    }
    return query;
  }

  /**
   * Auxillary function for recursively getting the nested array of children files for getDescendantsByFolder.
   * @param folderID - the ancestor folder.
   * @param ownerID - owner of said folder.
   * @param query - the conditions.
   * @param currArray - the array sent in the recursion.
   */
  private static async getPopulatedChildren(folderID: string, ownerID: string, query: Partial<IFile>) : Promise<ResFile[]> {
    const folderFiles: IFile[] = await this.getFilesByFolder(folderID, ownerID, query);
    const childrenArray : ResFile[] = [];

    for (let i = 0 ; i < folderFiles.length ; i++) {
      const currChild = new ResFile(folderFiles[i]);
      const grandChildren = await this.getPopulatedChildren(currChild.id, ownerID, query);
      currChild.children = grandChildren;
      childrenArray.push(currChild);
    }

    return childrenArray;
  }

}
