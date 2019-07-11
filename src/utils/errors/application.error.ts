import { statusToString } from './grpc.status';
import * as grpc from 'grpc';
/**
 * This file contains extended errors for the application.
 */

export class ApplicationError extends Error {
  public code: number;
  public name: string;

  constructor(message?: string, code?: number) {
    super();

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'unknown application error';
    this.code = code || grpc.status.UNKNOWN;
    this.name = statusToString(code);
  }
}

export class ServerError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'server side error', code || grpc.status.UNKNOWN);
  }
}

export class ClientError extends ApplicationError {
  constructor(message?: string, code?: number) {
    super(message || 'client side error', code || grpc.status.INVALID_ARGUMENT);
  }
}
