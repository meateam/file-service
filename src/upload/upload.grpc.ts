import { IUpload } from './upload.interface';
import { UploadService } from './upload.service';

// The highest level of the micro-service functions that run.
// These methods receive the grpc request and call the upload service methods.
export class UploadMethods {

  // Generates a random key for the upload.
  public static GenerateKey(call: any, callback: any) {
    return { key: UploadService.generateKey() };
  }

  // Creates an upload object, present while uploading a file.
  public static async CreateUpload(call: any, callback: any): Promise<IUpload> {
    const key: string = UploadService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    const ownerID: string = call.request.ownerID;
    const parent: string = call.request.parent;
    const size: number = parseInt(call.request.size, 10);
    return UploadService.createUpload(key, bucket, name, ownerID, parent, size);
  }

  // Creates an upload object, present while updateing a file.
  public static async CreateUpdate(call: any, callback: any): Promise<IUpload> {
    const key: string = UploadService.generateKey();
    const bucket: string = call.request.bucket;
    const name: string = call.request.name;
    const ownerID: string = call.request.ownerID;
    const parent: string = call.request.parent;
    const size: number = parseInt(call.request.size, 10);
    return UploadService.createUpdate(key, bucket, name, ownerID, parent, size);
  }

  // Updates the uploadID.
  public static async UpdateUploadID(call: any, callback: any): Promise<IUpload> {
    const key: string = call.request.key;
    const uploadID: string = call.request.uploadID;
    const bucket: string = call.request.bucket;
    return UploadService.updateUpload(uploadID, key, bucket);
  }

  // Get an upload metadata by its id in the DB.
  public static async GetUploadByID(call: any, callback: any): Promise<IUpload> {
    const id: string = call.request.uploadID;
    return UploadService.getUploadById(id);
  }

  //  Delete an upload from the DB by its id.
  public static async DeleteUploadByID(call: any, callback: any): Promise<void> {
    const id: string = call.request.uploadID;
    return UploadService.deleteUpload(id);
  }
}
