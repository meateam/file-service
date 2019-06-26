import { ClientError } from './application.error';

export class QuotaExceededError extends ClientError {
  constructor(message?: string) {
    super(message || 'quota exceeded', 3);
  }
}
