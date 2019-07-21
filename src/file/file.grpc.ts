import { FileService } from './file.service';
import { ResFile, IFile } from './file.interface';

// The highest level of the micro-service functions that run.
// These methods receive the grpc request and call the file service methods.
export class FileMethods {

  // Creates a new file in the DB.
  public static async CreateFile(call: any, callback: any): Promise<ResFile> {
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

  // Deletes a file, according to the file deletion policy.
  public static async DeleteFile(call: any, callback: any): Promise<{ok: boolean}> {
    const id: string = call.request.id;
    await FileService.delete(id);
    return { ok: true };
  }

  // Retrieves a file by its id.
  public static async GetFileByID(call: any, callback: any): Promise<ResFile> {
    const id: string = call.request.id;
    const file: IFile = await FileService.getById(id);
    return new ResFile(file);
  }

  // Retrieves a file by its key.
  public static async GetFileByKey(call: any, callback: any): Promise<ResFile> {
    const key: string = call.request.key;
    const file: IFile = await FileService.getByKey(key);
    return new ResFile(file);
  }

  // Retrieves all files residing in a given folder.
  public static async GetFilesByFolder(call: any, callback: any): Promise<{ files: ResFile[] }> {
    const folderID: string = call.request.folderID;
    const ownerID: string = call.request.ownerID;
    const foldersOnly: boolean = call.request.foldersOnly || false;
    const files: IFile[] = await FileService.getFilesByFolder(folderID, ownerID, foldersOnly);
    const resFiles: ResFile[] = files.length ? files.map(file => new ResFile(file)) : [];
    return { files: resFiles };
  }

  // Checks if an operation is allowed by permission of the owner.
  public static async IsAllowed(call: any, callback: any): Promise<{ allowed: boolean }> {
    const res: boolean = await FileService.isOwner(call.request.fileID, call.request.userID);
    return  { allowed: res };
  }
}
