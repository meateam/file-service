import { ObjectID } from 'mongodb';
import { IFile, IPopulatedShortcut, IShortcut, PrimitiveFile } from './file.interface';
import { baseFileModel, fileModel, shortcutModel } from './model';
import { getCurrTraceId, log, Severity } from '../utils/logger';
import { FileNotFoundError } from '../utils/errors/client.error';
import { shortcutModelName, fileModelName, getFailedMessage, baseModelName } from './model/config';
import { response } from 'express';

const pagination = {
  startIndex: 0,
  endIndex: 20,
};

const sort = {
  sortOrder: '-',
  sortBy: 'createdAt',
};

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the FileService class in file.service.ts .
 */
export default class FileRepository {
  /**
   * Adds a given file to the DB.
   * @param file - is the file to be added to the DB
   */
  static create(file: any): Promise<IFile> {
    file.parent = file.parent ? new ObjectID(file.parent) : null;
    return fileModel.create(file);
  }

  /**
  * Adds a given shortcut file to the DB.
  * @param file - is the shortcut file to be added to the DB
  */
  static async createShortcut(file: any): Promise<IFile> {
    const populatedShortcut = await this.baseFileToIFile(await shortcutModel.create(file));
    const shortcutAsFile: IFile = { ...(populatedShortcut.fileID as any), ...populatedShortcut };

    return shortcutAsFile;
  }

  // yarin's magic sorter, kinda...
  static yarin(input: any) {
    console.log("------------------------------");
    console.log(JSON.stringify(input, null, 2));
  }

  static getMyModel(id: string) {
    return baseFileModel.find({ id }).exec();
  }

  /**
   * Updates the file metatata by its id.
   * @param id - the file id.
   * @param partialFile - the partial file containing the attributes to be changed.
   */
  static async updateById(id: string, partialFile: Partial<IFile>): Promise<boolean> {
    const file = await this.baseFileToIFile(await baseFileModel.findById(id));
    if (!file) throw new FileNotFoundError();
    this.yarin(file);
    this.yarin(partialFile);
    const res = await baseFileModel.findByIdAndUpdate(id, { $set: partialFile }, { runValidators: true }).exec();
    // TODO: findByIdAndUpdate
    this.yarin(res);
    console.log("------------------------------");

    return res.isModified();
  }

  /**
   * Deletes a file from the DB.
   * @param id - the id of the file to be deleted.
   */
  static deleteById(id: string): Promise<IFile | null> {
    return fileModel.findByIdAndRemove({ _id: new ObjectID(id) }).exec();
  }

  /**
   * Getting a IPopulatedShortcut type file and converts its type to IFile.
   * @param file - the file that will be converted.
   */
  static populatedShortcutToFile(file: IPopulatedShortcut): IFile {
    const shortcutAsFile: IFile = { ...file.fileID, ...file };
    delete shortcutAsFile.fileID;
    return shortcutAsFile;
  }

  /**
   * Getting a baseFile type file and converts its type to IFile.
   * @param file - the file that will be converted.
   */
  static async baseFileToIFile(file: any): Promise<IFile> {
    const factoryFile: PrimitiveFile = this.fileFactory(file, file.fileModel);
    let responseFile: IFile = factoryFile as IFile;
    if (factoryFile instanceof IShortcut) {
      const populatedShortcut: IPopulatedShortcut = await (await file.populate('fileID').execPopulate()).toObject();
      responseFile = this.populatedShortcutToFile(populatedShortcut);
    }
    return responseFile
  }

  /**
   * Get the file by its id.
   * @param id - the id of the file.
   */
  static async getById(id: string): Promise<IFile> {
    const file = await baseFileModel.findById({ _id: new ObjectID(id) }).exec();

    return this.baseFileToIFile(file);
  }

  static fileFactory(file: any, type: string): PrimitiveFile {
    switch (type) {
      case fileModelName:
        return new IFile(file);
      case shortcutModelName:
        return new IShortcut(file);
      default:
        throw new Error('File type not supported');
    }
  }

  /**
   * Get the file by its key.
   * @param key - the key of the file.
   */
  static async getByKey(key: string): Promise<IFile> {
    const file = await baseFileModel.findOne({ key }).exec();

    return this.baseFileToIFile(file);
  }

  /**
   * Get several files by their ids.
   * @param ids - the array of the ids.
   */
  static async getByIds(ids: string[]): Promise<IFile[]> {
    const objIds: ObjectID[] = ids.map(id => new ObjectID(id));
    const files = await baseFileModel.find({
      _id: { $in: objIds },
    }).exec();

    const settledFiles = await Promise.allSettled(files.map(this.baseFileToIFile));
    const fulfilledFiles: IFile[] = (settledFiles.filter(file => file.status === 'fulfilled') as PromiseFulfilledResult<IFile>[]).map(file => file.value);
    const rejectedFiles = settledFiles.filter(file => file.status === 'rejected');
    const traceID: string = getCurrTraceId();
    log(Severity.WARN, getFailedMessage, 'get files warn', traceID, rejectedFiles);

    return fulfilledFiles;
  }

  /**
   * Get several files according to the specifications.
   * @param fileFilter - specific file attributes.
   * @param startIndex - start with this index to retrieve the files.
   * @param endIndex - last file index to retrieve.
   * @param sortOrder - sorting order.
   * @param sortBy - sort by option.
   */
  static async getMany(
    fileFilter: Partial<IFile>,
    startIndex: number = pagination.startIndex,
    endIndex: number = pagination.endIndex,
    sortOrder: string = sort.sortOrder,
    sortBy: string = sort.sortBy,
  ): Promise<any[] | IFile> {
    const files = await baseFileModel
      .find(fileFilter)
      .sort(sortOrder + sortBy)
      .skip(+startIndex)
      .limit((+endIndex) - (+startIndex))
      .exec();

    const setteledFiles = await Promise.allSettled(files.map(this.baseFileToIFile));
    const fullfilledFiles = setteledFiles.filter(file => file.status === 'fulfilled');
    const rejectedFiles = setteledFiles.filter(file => file.status === 'rejected');
    const traceID: string = getCurrTraceId();
    log(Severity.WARN, getFailedMessage, 'get files warn', traceID, rejectedFiles);

    return fullfilledFiles;
  }

  /**
   * Retrieves an array of files according to a condition.
   * @param condition - the condition for the search.
   * @param populate - an option to populate the retrieved file's fields.
   * @param select - select certain fields of the files.
   */
  static async find(condition?: Object, populate?: string | Object, select?: string): Promise<IFile[]> {

    let findPromise = baseFileModel.find(condition);
    if (populate) {
      findPromise = findPromise.populate(populate);
    }
    if (select) {
      findPromise = findPromise.select(select);
    }
    const fulfilledFiles: IFile[] = [];
    const rejectedFiles: IFile[] = [];
    const files = await baseFileModel.find(condition).exec();
    const setteledFiles = await Promise.allSettled(files.map(this.baseFileToIFile));
    setteledFiles.forEach((file) => {
      if (file.status === 'fulfilled' && file.value) fulfilledFiles.push(file.value);
      else rejectedFiles.push((file as PromiseRejectedResult).reason);
    });
    const traceID: string = getCurrTraceId();
    log(Severity.WARN, getFailedMessage, 'get files warn', traceID, rejectedFiles);

    return fulfilledFiles;
  }

  /**
   * Retrieve a file residing in a folder by its name.
   * @param parentId - the folder id.
   * @param filename - the name of the file (should be unique in the folder).
   * @param ownerID - the id of the owner/user who made the request.
   */
  static async getFileInFolderByName(parentId: string | null, filename: string, ownerID: string): Promise<IFile | null> {
    const parent: ObjectID = parentId ? new ObjectID(parentId) : null;
    const file = await baseFileModel.findOne({ ownerID, parent, name: filename }).exec();

    return this.baseFileToIFile(file)
  }
}
