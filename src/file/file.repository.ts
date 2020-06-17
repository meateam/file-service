import { ObjectID } from 'mongodb';
import { IFile } from './file.interface';
import { fileModel } from './file.model';
import { FileNotFoundError } from '../utils/errors/client.error';

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
    file.parent = file.parent ? new ObjectID(file.parent) : null;
    return fileModel.create(file);
  }

  /**
   * Updates the file metatata by its id.
   * @param id - the file id.
   * @param partialFile - the partial file containing the attributes to be changed.
   */
  static async updateById(id: string, partialFile: Partial<IFile>): Promise<boolean> {
    const file = await fileModel.findById(id);
    if (!file) throw new FileNotFoundError();

    const res = await fileModel.updateOne({ _id: file._id, ownerID: file.ownerID }, { $set: partialFile }, { runValidators: true }).exec();
    // const res = await file.updateOne(partialFile, { runValidators: true }).exec();
    return res.n === 1 && res.nModified === 1 && res.ok === 1;
  }

  /**
   * Deletes a file from the DB.
   * @param id - the id of the file to be deleted.
   */
  static deleteById(id: string): Promise<IFile | null> {
    return fileModel.findByIdAndRemove({ _id: new ObjectID(id) }).exec();
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
   * @param condition - the condition for the search.
   * @param populate - an option to populate the retrieved file's fields.
   * @param select - select certain fields of the files.
   */
  static find(condition?: Object, populate?: string | Object, select?: string): Promise<IFile[]> {

    let findPromise = fileModel.find(condition);
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
   * @param filename - the name of the file (should be unique in the folder).
   * @param ownerID - the id of the owner/user who made the request.
   */
  static getFileInFolderByName(parentId: string | null, filename: string, ownerID: string): Promise<IFile | null> {
    const parent: ObjectID = parentId ? new ObjectID(parentId) : null;
    return fileModel.findOne({ ownerID, parent, name: filename }).exec();
  }
}
