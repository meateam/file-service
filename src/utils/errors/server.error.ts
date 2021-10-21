import { ServerError } from './application.error';
import * as grpc from 'grpc';

export class UploadSizeError extends ServerError {
  constructor(message?: string) {
    super(message || 'upload size is negative', grpc.status.OUT_OF_RANGE);
  }
}
