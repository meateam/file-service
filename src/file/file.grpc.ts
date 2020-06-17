import { FileService } from './file.service';
import { ResFile, IFile, deleteRes } from './file.interface';
import { ServerUnaryCall } from 'grpc';
import { getCurrTraceId, log, Severity } from '../utils/logger';
import { getDisplayError } from './../utils/errors/error.helper';
import { IdInvalidError } from './../utils/errors/client.error';

interface FailedFile {
  id: string;
  error: string;
}

/**
 * The highest level of the micro-service functions that run.
 * These methods receive the grpc request and call the file service methods.
 */
export class FileMethods {
  /**
   * Creates a new file in the DB.
   * @param call
   */
  public static async CreateFile(call: any): Promise<ResFile> {
    const params = call.request;
    const createdFile = await FileService.create(
      params.bucket,
      params.name,
      params.ownerID,
      params.type,
      params.parent,
      params.key,
      parseInt(params.size, 10),
    );
    return new ResFile(createdFile);
  }

  /**
   * Deletes a file, according to the file deletion policy.
   * @param call
   */
  public static async DeleteFile(call: any): Promise<{ files: deleteRes[] }> {
    const id: string = call.request.id;
    const files: deleteRes[] = await FileService.delete(id);
    return { files };
  }

  /**
   * Deletes a file, according to the file deletion policy.
   * @param call
   */
  public static async DeleteFileByID(call: any): Promise<{ file: IFile }> {
    const id: string = call.request.id;
    const file: IFile = await FileService.deleteByID(id);
    return { file };
  }

  /**
   * UpdateFiles updates a list of files and responses with a list of the files' id
   * which succeeded the operation.
   */
  public static async UpdateFiles(call: ServerUnaryCall<{ partialFile: Partial<IFile>, idList: string[] }>)
  : Promise<{ failedFiles: FailedFile[] }> {
    const failed: { id: string, error: Error }[] = await FileService.updateMany(call.request.idList, call.request.partialFile);
    const traceID: string = getCurrTraceId();
    const failedFiles: FailedFile[] = [];
    for (let i = 0; i < failed.length; i++) {
      log(Severity.ERROR, failed[i].error.toString(), 'update files error', traceID, failed[i]);
      const displayError: string = getDisplayError(failed[i].error);
      failedFiles.push({ id: failed[i].id, error: displayError });
    }
    return { failedFiles };
  }

  /**
   * Retrieves a file by its id.
   * @param call
   */
  public static async GetFileByID(call: any): Promise<ResFile> {
    const id: string = call.request.id;
    const file: IFile = await FileService.getById(id);
    return new ResFile(file);
  }

  /**
   * Retrieves a file by its key.
   * @param call
   */
  public static async GetFileByKey(call: any): Promise<ResFile> {
    const key: string = call.request.key;
    const file: IFile = await FileService.getByKey(key);
    return new ResFile(file);
  }

  /**
   * Retrieves all files residing in a given folder.
   * @param call
   */
  public static async GetFilesByFolder(call: any): Promise<{ files: ResFile[] }> {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    const queryFile: ResFile = call.request.queryFile || {};
    const files: IFile[] = await FileService.getFilesByFolder(folderID, ownerID, new IFile(queryFile));
    const resFiles: ResFile[] = files.length ? files.map(file => new ResFile(file)) : [];
    return { files: resFiles };
  }

  /**
   * Retrieves all files residing in a given folder.
   * @param call
   */
  public static async GetDescendantsByFolder(call: any): Promise<{ files: ResFile[] }> {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    const queryFile: ResFile = call.request.queryFile || {};
    const queryIFile = new IFile(queryFile);
    const files: ResFile[] = await FileService.getDescendantsByFolder(folderID, ownerID, queryIFile);
    return { files };
  }

  public static async GetDescendantsByID(call: any): Promise<{ descendants: {file: ResFile, parent: ResFile}[] }> {
    const folderID: string = call.request.id;

    if (!folderID) throw new IdInvalidError();

    const descendants: {file: IFile, parent: IFile}[] = await FileService.getDescendantsByID(folderID);
    const ResFileDescendants: {file: ResFile, parent: ResFile}[] = descendants.map((e) => {
      return {
        file: new ResFile(e.file),
        parent: new ResFile(e.parent),
      };
    });

    return { descendants: ResFileDescendants };
  }

  /**
   * Checks if an operation is allowed by permission of the owner.
   * @param call
   */
  public static async IsAllowed(call: any): Promise<{ allowed: boolean }> {
    const res: boolean = await FileService.isOwner(call.request.fileID, call.request.userID);
    return  { allowed: res };
  }

  public static async GetAncestors(call: any): Promise<{ancestors: string[]}> {
    const fileID: string = call.request.id;
    if (!fileID) throw new IdInvalidError();

    const ancestors = await FileService.getAncestors(fileID);

    return { ancestors };
  }
}
