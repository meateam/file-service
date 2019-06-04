import { ObjectID } from 'mongodb';
import { IFile } from './file.interface';
import { fileModel } from './file.model';

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
  static create(file: IFile): Promise<IFile> {
    return fileModel.create(file);
  }

  /**
   * Updates the file metatata by its id.
   * @param id - the file id.
   * @param partialFile - the partial file containing the attributes to be changed.
   */
  static updateById(id: string, partialFile: Partial<IFile>): Promise<IFile | null> {
    return fileModel.findByIdAndUpdate(id, partialFile, { new: true, runValidators: true }).exec();
  }

  /**
   * Changes 'deleted' flag to true. Does not delete from th DB.
   * @param id - the id of the file to be deleted.
   */
  static deleteById(id: string): Promise<IFile | null> {
    return fileModel.findByIdAndUpdate({ _id: new ObjectID(id) }, { deleted: true }, { new: true, runValidators: true }).exec();
  }

  /**
   * Get the file by its id.
   * @param id - the id of the file.
   */
  static getById(id: string): Promise<IFile | null> {
    return fileModel.findById({ _id: new ObjectID(id) }).exec();
  }

  /**
   * Get the file by its key.
   * @param key - the key of the file.
   */
  static getByKey(key: string): Promise<IFile | null> {
    return fileModel.findOne({ key }).exec();
  }

  /**
   * Get several filed by their ids.
   * @param ids - the array of the ids.
   */
  static getByIds(ids: string[]): Promise<IFile[]> {
    const objIds: ObjectID[] = ids.map(id => new ObjectID(id));
    return fileModel.find({
      _id: { $in: objIds },
    }).exec();
  }

  /**
   * Get several files according to the specifications.
   * @param fileFilter - specific file attributes.
   * @param startIndex - start with this index to retrieve the files.
   * @param endIndex - last file index to retrieve.
   * @param sortOrder - sorting order.
   * @param sortBy - sort by option.
   */
  static getMany(
    fileFilter: Partial<IFile>,
    startIndex: number = pagination.startIndex,
    endIndex: number = pagination.endIndex,
    sortOrder: string = sort.sortOrder,
    sortBy: string = sort.sortBy,
  ): Promise<IFile[]> {
    return fileModel
      .find(fileFilter)
      .sort(sortOrder + sortBy)
      .skip(+startIndex)
      .limit((+endIndex) - (+startIndex))
      .exec();
  }

  /**
   * Retrieves an array of files according to a condition.
   * @param cond - the condiotion for the search.
   * @param populate - an option to populate the retrieved file's fields.
   * @param select - seelect certain fields of the files.
   */
  static find(cond?: Object, populate?: string | Object, select?: string): Promise<IFile[]> {

    let findPromise = fileModel.find(cond);
    if (populate) {
      findPromise = findPromise.populate(populate);
    }
    if (select) {
      findPromise = findPromise.select(select);
    }

    return findPromise.exec().then((result) => {
      return (result ? result.map((mongoObject => mongoObject.toObject())) : result);
    });
  }

  /**
   * Retrieve a file residing in a folder by its name.
   * @param parentId - the folder id.
   * @param fileFullName - the name of the file (should be unique in the folder).
   */
  static getFileInFolderByName(parentId: string, fileFullName: string): Promise<IFile | null> {
    const displayName = fileFullName.split('.')[0];
    const fullExtension = fileFullName.split('.').splice(1).join('.');
    return fileModel.findOne({ displayName, fullExtension, parent: new ObjectID(parentId), deleted: false }).exec();
  }
}
