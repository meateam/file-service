import { ClientError } from './application.error';
import * as grpc from 'grpc';

export class QuotaExceededError extends ClientError {
  constructor(message?: string) {
    super(grpc.status.RESOURCE_EXHAUSTED, message || 'quota exceeded');
  }
}
