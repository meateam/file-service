import { FileService } from './file.service';
import { ResFile, IFile, deleteRes } from './file.interface';
import { ServerUnaryCall } from 'grpc';
import { getCurrTraceId, log, Severity } from '../utils/logger';

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
   * UpdateFiles updates a list of files and responses with a list of the files' id
   * which succeeded the operation.
   */
  public static async UpdateFiles(call: ServerUnaryCall<{ partialFile: Partial<IFile>, idList: string[] }>) {
    const { updated, failed } = await FileService.updateMany(call.request.idList, call.request.partialFile);
    const traceID = getCurrTraceId();
    for (let i = 0; i < failed.length; i++) {
      log(Severity.ERROR, failed[i].error.message, 'update files error', traceID, failed[i]);
    }
    return { updated };
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

  /**
   * Checks if an operation is allowed by permission of the owner.
   * @param call
   */
  public static async IsAllowed(call: any): Promise<{ allowed: boolean }> {
    const res: boolean = await FileService.isOwner(call.request.fileID, call.request.userID);
    return  { allowed: res };
  }
}
