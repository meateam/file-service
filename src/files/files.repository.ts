import { IFile } from './files.interface';
import { fileModel } from './files.model';

const pagination = {
  startIndex: 0,
  endIndex: 20,
};

const sort = {
  sortOrder: '-',
  sortBy: 'createdAt',
};

export default class FilesRepository {
  static create(file: IFile): Promise<IFile> {
    return fileModel.create(file);
  }

  static updateById(id: string, user: Partial<IFile>): Promise<IFile | null> {
    return fileModel.findByIdAndUpdate(id, user, { new: true, runValidators: true }).exec();
  }

  static deleteById(id: string): Promise<IFile | null> {
    return fileModel.findByIdAndRemove(id).exec();
  }

  static getById(id: string): Promise<IFile | null> {
    return fileModel.findById(id).exec();
  }

  static getByKey(key: string): Promise<IFile | null> {
    return fileModel.findOne({ key }).exec();
  }

  static getByIds(ids: string[]): Promise<IFile[]> {
    return fileModel.find({
      _id: { $in: ids },
    }).exec();
  }

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
  static getRootFolder(folderName: string): Promise<IFile | null> {
    return fileModel.findOne({ fullName: folderName, isRootFolder: true }).exec();
  }

  static getFileInFolderByName(parentId: string, fileFullName: string): Promise<IFile | null> {
    return fileModel.findOne({ fullName: fileFullName, parent: parentId }).exec();
  }
}
