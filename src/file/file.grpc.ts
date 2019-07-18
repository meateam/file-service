import { FileService } from './file.service';
import { ResFile, IFile } from './file.interface';
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
  public static async DeleteFile(call: any): Promise<{ok: boolean}> {
    const id: string = call.request.id;
    await FileService.delete(id);
    return { ok: true };
	}
	
	public static async UpdateFiles(call: ServerUnaryCall<(Partial<IFile> & { id: string })[]>) {
		const { updated, failed } = await FileService.updateMany(call.request);
		const traceID = getCurrTraceId();
		for (let i = 0; i < failed.length; i++) {
			log(Severity.ERROR, 'update files error', failed[i].error.message, traceID, failed[i]);
		}

		const failedIds = failed.map(file => file.id);
		return { updated, failedIds};
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
    const files: IFile[] = await FileService.getFilesByFolder(folderID, ownerID);
    const resFiles: ResFile[] = files.length ? files.map(file => new ResFile(file)) : [];
    return { files: resFiles };
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
