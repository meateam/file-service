import * as express from 'express';
import { IFile } from './file.interface';
import { fileModel, IFileModel } from './file.model';
import FileRepository from './files.repository';
import * as FileErrors from '../errors/file';
import { fileService } from './files.service';

export class fileController {
  static _repository: FileRepository = new FileRepository();

  public static async create(files: IFile[]): Promise<IFile[]> {
    const services: Promise<IFile>[] = files.map((val) => {
      return fileService.create(val);
    });
    return await Promise.all(services);
  }

  public static async getFiles(cond?: Object): Promise<IFile[]> {
    const files = await fileController._repository.find(cond);
    return <IFileModel[]> files;
  }

  public static findById(fileId: string): Promise<IFile> {
    return fileService.findById(fileId);
  }

  public static findByDate(from?: string, to?: string): Promise<IFile[]> {
    let fromDate;
    let toDate;
    if (from) fromDate = new Date(from);
    else fromDate = new Date('0000000000000');
    if (to) toDate = new Date(to);
    else toDate = new Date();
    return fileService.findByCreationDate(fromDate, toDate);
  }

  public static async delete(fileId: string): Promise<any> {
    const currFile: IFile = await fileController.findById(fileId);
    const ret = await fileService.delete(fileId);
    if (ret) {
      return ret;
    }
    throw new FileErrors.FileNotFoundError();
  }

  public static async update(fileId: string, file: Partial<IFile>): Promise<IFile> {
    const oldFile: IFile = await fileController.findById(fileId);
    const currFile = await fileService.update(fileId, file);
    if (currFile) {
      return currFile;
    }
    throw new FileErrors.FileNotFoundError();
  }
}
