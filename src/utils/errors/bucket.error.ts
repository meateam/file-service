import { ClientError } from './application.error';

export class BucketQuotaExceededError extends ClientError {
  constructor(message?: string) {
    super(message || 'bucket quota exceeded', 3);
  }
}
