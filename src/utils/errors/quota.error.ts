import { ClientError } from './application.error';
import * as grpc from 'grpc';

export class QuotaExceededError extends ClientError {
  constructor(message?: string) {
    super(message || 'quota exceeded', grpc.status.RESOURCE_EXHAUSTED);
  }
}
