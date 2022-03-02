import { ObjectID } from 'mongodb';
import { IBaseFile, IFile, IPopulatedShortcut, IShortcut, PrimitiveFile } from './file.interface';
import { baseFileModel, fileModel, shortcutModel } from './model';
import { getCurrTraceId, log, Severity } from '../utils/logger';
import { fileModelName, getFailedMessage, shortcutModelName } from './model/config';

const pagination = {
  startIndex: 0,
  endIndex: 20,
};

const sort = {
  sortOrder: '-',
  sortBy: 'createdAt',
};

const shortcutSize = 0;

/**
 * The repository connects the file-service with the mongo DB.
 * It is the 'lowest' level of code before making changes in the database or retrieving information from it.
 * Usually called from the FileService class in file.service.ts .
 */
export default class FileRepository {
  /**
   * Add a given file to the DB.
   * @param file - is the file to be added to the DB
   */
  static create(file: IFile): Promise<IFile> {
    file.parent = file.parent ? new ObjectID(file.parent) : null;
    return fileModel.create(file);
  }

  /**
  * Add a given shortcut file to the DB.
  * Returns a populated shortcut as an IFile.
  * @param file - is the shortcut file to be added to the DB
  */
  static async createShortcut(file: any): Promise<IFile> {
    file.parent = file.parent ? new ObjectID(file.parent) : null;
    const populatedShortcut = await shortcutModel.create(file);
    const shortcutAsFile: IFile = await this.baseFileToIFile(populatedShortcut);
    return shortcutAsFile;
  }

  /**
   * Update a file metatata by its id.
   * @param id - the file id.
   * @param partialFile - the partial file containing the attributes to be changed.
   */
  static async updateById(id: any, partialFile: Partial<IFile>, model: any): Promise<boolean> {
    const file = await baseFileModel.findById(id);
    const res = await model.updateOne({ _id: file._id, ownerID: file.ownerID }, { $set: partialFile }, { runValidators: true }).exec();
    return res.n === 1 && res.nModified === 1 && res.ok === 1;
  }

  /**
   * Delete a file from the DB.
   * @param id - the id of the file to be deleted.
   */
  static async deleteById(id: string, model: any): Promise<IFile | null> {
    return model.findByIdAndRemove({ _id: new ObjectID(id) }).exec();
  }

  /**
   * Get an IPopulatedShortcut type file and converts it to IFile types.
   * Returns a populated shortcut file as an IFile.
   * @param file - the file that will be converted.
   */
  static populatedShortcutToFile(file: IPopulatedShortcut): IFile {
    const shortcutAsFile: IFile = { ...file.fileID, ...file };
    const parentID = file.fileID.id
    delete shortcutAsFile.fileID
    shortcutAsFile.fileID = parentID;
    return shortcutAsFile;
  }

  /**
* Get a file and its fileModel parameter and casts it to the correct class.
* @param file - the file that its type being casted
* @param type - the type that's using to cast the file
* @returns file that's being casted corrcetly
*/
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
   * Get a baseFile type file and converts its type to IFile.
   * @param file - the file that will be converted.
   */
  static async baseFileToIFile(file: any): Promise<IFile> {
    const factoryFile: PrimitiveFile = this.fileFactory(file, file.fileModel);
    // factoryFile's type is IFile because its the default file type that's not a shortcut.
    let responseFile: IFile = factoryFile as IFile;
    if (factoryFile instanceof IShortcut) {
      const populatedShortcut: IPopulatedShortcut = await (await file.populate('fileID').execPopulate()).toObject();
      responseFile = this.populatedShortcutToFile(populatedShortcut);
      responseFile.size = shortcutSize;
    }
    return responseFile;
  }

  /**
   * Get a file by its id.
   * @param id - the id of the file.
   */
  static async getById(id: string): Promise<IBaseFile> {
    const file = await baseFileModel.findById({ _id: new ObjectID(id) }).exec();
    return file;
  }

  /**
   * Get a file by its key.
   * @param key - the key of the file.
   */
  static async getByKey(key: string): Promise<IFile> {
    const file = await fileModel.findOne({ key }).exec();
    return file;
  }

  /**
   * Get several files by their ids.
   * @param ids - array of the files ids.
   */
  static async getByIds(ids: string[]): Promise<IFile[]> {
    const objIds: ObjectID[] = ids.map(id => new ObjectID(id));
    const files = await baseFileModel.find({
      _id: { $in: objIds },
    }).exec();
    const fulfilledFiles: IFile[] = [];
    const rejectedFiles: IFile[] = [];
    const settledFiles = await Promise.allSettled(files.map(this.baseFileToIFile));
    settledFiles.forEach((file) => {
      if (file.status === 'fulfilled' && file.value) fulfilledFiles.push((file as PromiseFulfilledResult<IFile>).value);
      else rejectedFiles.push((file as PromiseRejectedResult).reason);
    });
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
  ): Promise<any[] | IFile[]> {
    const files = await baseFileModel
      .find(fileFilter)
      .sort(sortOrder + sortBy)
      .skip(+startIndex)
      .limit((+endIndex) - (+startIndex))
      .exec();

    const fulfilledFiles: IFile[] = [];
    const rejectedFiles: IFile[] = [];
    const settledFiles = await Promise.allSettled(files.map(this.baseFileToIFile));
    settledFiles.forEach((file) => {
      if (file.status === 'fulfilled' && file.value) fulfilledFiles.push(file.value);
      else rejectedFiles.push((file as PromiseRejectedResult).reason);
    });
    const traceID: string = getCurrTraceId();
    log(Severity.WARN, getFailedMessage, 'get files warn', traceID, rejectedFiles);

    return fulfilledFiles;
  }

  /**
   * Retrieves an array of files according to a condition.
   * @param condition - the condition for the search.
   * @param populate - an option to populate the retrieved file's fields.
   * @param select - select certain fields of the files.
   */
  static async find(condition?: Object, populate?: string | Object, select?: string): Promise<IFile[]> {

    let findPromise = fileModel.find(condition);
    if (populate) {
      findPromise = findPromise.populate(populate);
    }
    if (select) {
      findPromise = findPromise.select(select);
    }
    const fulfilledFiles: IFile[] = [];
    const rejectedFiles: IFile[] = [];
    const files = await findPromise.find(condition).exec();
    const setteledFiles = await Promise.allSettled(files.map(file => this.baseFileToIFile(file)));
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

    return await fileModel.findOne({ ownerID, parent, name: filename }).exec();
  }
}
