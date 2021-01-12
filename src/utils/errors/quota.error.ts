import { ClientError } from './application.error';
import * as grpc from 'grpc';

export class QuotaExceededError extends ClientError {
  constructor(message?: string) {
    super(message || 'quota exceeded', grpc.status.RESOURCE_EXHAUSTED);
  }
}

export class QuotaOutOfRangeError extends ClientError {
  constructor(message?: string) {
    super(message || 'quota is not the rightful range (down or up)', grpc.status.OUT_OF_RANGE);
  }
}

export class QuotaLimitOutOfRangeError extends QuotaOutOfRangeError {
  constructor(used: number, requested: number) {
    super(`quota is not the rightful range (down or up). Used: ${used}, Requested: ${requested}`);
  }
}
